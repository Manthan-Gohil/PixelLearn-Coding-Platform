"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { User, Badge, Course } from "@/types";
export type { User, Badge, Course };
import { BADGES, COURSES } from "@/services/data";

type SyncStatus = "idle" | "syncing" | "success" | "error";

const EMPTY_USER: User = {
    id: "",
    email: "",
    name: "Learner",
    avatar: "",
    subscription: "free",
    xp: 0,
    streak: 0,
    badges: [],
    enrolledCourses: [],
    completedExercises: [],
    referralCode: "",
    referralCount: 0,
    createdAt: new Date(0).toISOString(),
    lastActive: new Date(0).toISOString(),
};

interface AppState {
    user: User;
    syncStatus: SyncStatus;
    syncError: string | null;
    enrollCourse: (courseId: string) => void;
    completeExercise: (exerciseId: string, xpReward: number) => void;
    getUserProgress: (courseId: string, course?: Course) => { completed: number; total: number; percentage: number };
    isExerciseCompleted: (exerciseId: string) => boolean;
    updateSubscription: (plan: "free" | "pro") => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const { user: clerkUser, isSignedIn, isLoaded } = useClerkUser();
    const [user, setUser] = useState<User>(EMPTY_USER);
    const [dbSynced, setDbSynced] = useState(false);
    const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
    const [syncError, setSyncError] = useState<string | null>(null);

    const applySyncedUser = useCallback(
        (payload: unknown) => {
            const dbUser = payload as Partial<User> & {
                id?: string;
                createdAt?: string;
                lastActive?: string;
            };

            if (!dbUser?.id || !clerkUser) {
                return false;
            }

            setUser({
                ...EMPTY_USER,
                id: dbUser.id,
                clerkId: clerkUser.id,
                email: dbUser.email ?? clerkUser.primaryEmailAddress?.emailAddress ?? "",
                name: dbUser.name ?? clerkUser.fullName ?? clerkUser.firstName ?? "Learner",
                avatar: dbUser.avatar ?? clerkUser.imageUrl ?? "",
                subscription: dbUser.subscription ?? "free",
                xp: dbUser.xp ?? 0,
                streak: dbUser.streak ?? 0,
                enrolledCourses: Array.isArray(dbUser.enrolledCourses) ? dbUser.enrolledCourses : [],
                completedExercises: Array.isArray(dbUser.completedExercises) ? dbUser.completedExercises : [],
                badges: Array.isArray(dbUser.badges) ? dbUser.badges : [],
                referralCode: dbUser.referralCode ?? "",
                referralCount: dbUser.referralCount ?? 0,
                createdAt: dbUser.createdAt ?? new Date().toISOString(),
                lastActive: dbUser.lastActive ?? new Date().toISOString(),
            });

            return true;
        },
        [clerkUser]
    );

    // Sync Clerk user -> local state + DB
    useEffect(() => {
        if (isLoaded && isSignedIn && clerkUser && !dbSynced) {
            fetch("/api/user/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clerkId: clerkUser.id,
                    email: clerkUser.primaryEmailAddress?.emailAddress || "",
                    name: clerkUser.fullName || clerkUser.firstName || "Learner",
                    avatar: clerkUser.imageUrl || "",
                }),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        throw new Error("Failed to sync user");
                    }
                    return res.json();
                })
                .then((dbUser) => {
                    const applied = applySyncedUser(dbUser);
                    if (!applied) {
                        throw new Error("Invalid sync payload");
                    }
                    setSyncStatus("success");
                    setDbSynced(true);
                })
                .catch(() => {
                    setUser({
                        ...EMPTY_USER,
                        id: clerkUser.id,
                        clerkId: clerkUser.id,
                        email: clerkUser.primaryEmailAddress?.emailAddress || "",
                        name: clerkUser.fullName || clerkUser.firstName || "Learner",
                        avatar: clerkUser.imageUrl || "",
                    });
                    setSyncStatus("error");
                    setSyncError("Unable to sync profile. Please refresh and try again.");
                    setDbSynced(true);
                });
        } else if (isLoaded && !isSignedIn) {
            queueMicrotask(() => {
                setUser(EMPTY_USER);
                setDbSynced(false);
                setSyncStatus("idle");
                setSyncError(null);
            });
        }
    }, [isLoaded, isSignedIn, clerkUser, dbSynced, applySyncedUser]);

    const enrollCourse = useCallback((courseId: string) => {
        if (!courseId) return;

        const previousEnrolledCourses = user.enrolledCourses;

        setUser((prev) => {
            if (prev.enrolledCourses.includes(courseId)) return prev;
            return {
                ...prev,
                enrolledCourses: [...prev.enrolledCourses, courseId],
            };
        });

        fetch("/api/user/enroll", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courseId }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error("Enroll request failed");
                }
                return res.json();
            })
            .then((payload) => {
                if (Array.isArray(payload?.enrolledCourses)) {
                    setUser((prev) => ({
                        ...prev,
                        enrolledCourses: payload.enrolledCourses,
                    }));
                    return;
                }

                return fetch("/api/user/sync")
                    .then(async (res) => {
                        if (!res.ok) {
                            throw new Error("Sync request failed");
                        }
                        return res.json();
                    })
                    .then((syncedPayload) => {
                        applySyncedUser(syncedPayload);
                    });
            })
            .catch(() => {
                setUser((prev) => ({
                    ...prev,
                    enrolledCourses: previousEnrolledCourses,
                }));
            });
    }, [applySyncedUser, user.enrolledCourses]);

    const completeExercise = useCallback((exerciseId: string, xpReward: number) => {
        let newCompleted: string[] = [];

        setUser((prev) => {
            if (prev.completedExercises.includes(exerciseId)) {
                newCompleted = prev.completedExercises;
                return prev;
            }
            const newXP = prev.xp + xpReward;
            newCompleted = [...prev.completedExercises, exerciseId];
            const newStreak = prev.streak + 1;

            // Check for new badges
            const newBadges: Badge[] = [...prev.badges];
            BADGES.forEach((badge) => {
                const alreadyHas = newBadges.some((b) => b.id === badge.id);
                if (alreadyHas) return;

                let unlocked = false;
                switch (badge.requirement.type) {
                    case "xp":
                        unlocked = newXP >= badge.requirement.value;
                        break;
                    case "streak":
                        unlocked = newStreak >= badge.requirement.value;
                        break;
                    case "exercises":
                        unlocked = newCompleted.length >= badge.requirement.value;
                        break;
                    case "course_complete": {
                        const completedCourses = COURSES.filter((course) => {
                            const allExercises = course.chapters.flatMap((ch) =>
                                ch.exercises.map((ex) => ex.id)
                            );
                            return allExercises.every((id: string) => [...newCompleted].includes(id));
                        });
                        unlocked = completedCourses.length >= badge.requirement.value;
                        break;
                    }
                }

                if (unlocked) {
                    newBadges.push({ ...badge, unlockedAt: new Date().toISOString() });
                }
            });

            return {
                ...prev,
                xp: newXP,
                streak: newStreak,
                completedExercises: newCompleted,
                badges: newBadges,
                lastActive: new Date().toISOString(),
            };
        });

        // Sync to DB
        fetch("/api/user/complete-exercise", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ exerciseId, xpReward }),
        }).catch(() => { });
    }, []);

    const getUserProgress = useCallback(
        (courseId: string, courseOverride?: Course) => {
            const course = courseOverride ?? COURSES.find((c) => c.id === courseId);
            if (!course) return { completed: 0, total: 0, percentage: 0 };

            const allExercises = course.chapters.flatMap((ch) =>
                ch.exercises.map((ex) => ex.id)
            );
            const completed = allExercises.filter((id) =>
                user.completedExercises.includes(id)
            ).length;
            const total = allExercises.length;
            const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

            return { completed, total, percentage };
        },
        [user.completedExercises]
    );

    const isExerciseCompleted = useCallback(
        (exerciseId: string) => {
            return user.completedExercises.includes(exerciseId);
        },
        [user.completedExercises]
    );

    const updateSubscription = useCallback((plan: "free" | "pro") => {
        setUser((prev) => ({ ...prev, subscription: plan }));

        fetch("/api/user/subscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan }),
        }).catch(() => { });
    }, []);

    return (
        <AppContext.Provider
            value={{
                user,
                syncStatus,
                syncError,
                enrollCourse,
                completeExercise,
                getUserProgress,
                isExerciseCompleted,
                updateSubscription,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within AppProvider");
    }
    return context;
}
