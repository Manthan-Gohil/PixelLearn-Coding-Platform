"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { User, Badge, Course } from "@/types";
export type { User, Badge, Course };
import { BADGES, COURSES } from "@/services/data";

type SyncStatus = "idle" | "syncing" | "success" | "error";

interface AppErrorState {
    message: string;
    retryLabel?: string;
}

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
    appError: AppErrorState | null;
    isRetryingAction: boolean;
    activeBadgeUnlock: Badge | null;
    enrollCourse: (courseId: string) => void;
    completeExercise: (exerciseId: string, xpReward: number) => void;
    dismissActiveBadgeUnlock: () => void;
    dismissAppError: () => void;
    retryLastAction: () => void;
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
    const [appError, setAppError] = useState<AppErrorState | null>(null);
    const [isRetryingAction, setIsRetryingAction] = useState(false);
    const [badgeUnlockQueue, setBadgeUnlockQueue] = useState<Badge[]>([]);
    const syncInFlightRef = useRef(false);
    const enrollingCourseIdsRef = useRef<Set<string>>(new Set());
    const lastRetryActionRef = useRef<(() => void) | null>(null);

    const applySyncedUser = useCallback(
        (payload: unknown) => {
            const dbUser = payload as Partial<User> & {
                id?: string;
                createdAt?: string;
                lastActive?: string;
                lastStreakDate?: string | null;
                lastDailyBonusDate?: string | null;
            };

            if (!dbUser?.id || !clerkUser) {
                return false;
            }

            const normalizedBadges: Badge[] = [];

            if (Array.isArray(dbUser.badges)) {
                dbUser.badges.forEach((badge) => {
                    const badgeId = typeof badge?.id === "string" ? badge.id : null;
                    if (!badgeId) return;
                    const definition = BADGES.find((item) => item.id === badgeId);
                    if (!definition) return;
                    const unlockedAt =
                        typeof badge?.unlockedAt === "string"
                            ? badge.unlockedAt
                            : new Date().toISOString();
                    normalizedBadges.push({
                        ...definition,
                        unlockedAt,
                    });
                });
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
                badges: normalizedBadges,
                referralCode: dbUser.referralCode ?? "",
                referralCount: dbUser.referralCount ?? 0,
                lastStreakDate: dbUser.lastStreakDate ?? undefined,
                lastDailyBonusDate: dbUser.lastDailyBonusDate ?? undefined,
                createdAt: dbUser.createdAt ?? new Date().toISOString(),
                lastActive: dbUser.lastActive ?? new Date().toISOString(),
            });

            return true;
        },
        [clerkUser]
    );

    const runDailyCheck = useCallback(async () => {
        const response = await fetch("/api/user/daily-check", {
            method: "POST",
        });

        if (!response.ok) {
            throw new Error("Daily check failed");
        }

        const dailyPayload = await response.json();
        const updated = dailyPayload?.user;
        if (updated) {
            applySyncedUser(updated);
        }
    }, [applySyncedUser]);

    const syncUser = useCallback(async () => {
        if (!isLoaded || !isSignedIn || !clerkUser || syncInFlightRef.current) {
            return;
        }

        syncInFlightRef.current = true;
        setSyncStatus("syncing");
        setSyncError(null);
        setAppError(null);

        try {
            const response = await fetch("/api/user/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clerkId: clerkUser.id,
                    email: clerkUser.primaryEmailAddress?.emailAddress || "",
                    name: clerkUser.fullName || clerkUser.firstName || "Learner",
                    avatar: clerkUser.imageUrl || "",
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to sync user");
            }

            const dbUser = await response.json();
            const applied = applySyncedUser(dbUser);
            if (!applied) {
                throw new Error("Invalid sync payload");
            }

            try {
                await runDailyCheck();
                lastRetryActionRef.current = null;
            } catch {
                setAppError({
                    message: "Profile synced, but the daily bonus check could not be refreshed.",
                    retryLabel: "Retry sync",
                });
                lastRetryActionRef.current = () => syncUser();
            }

            setSyncStatus("success");
            setSyncError(null);
            setDbSynced(true);
        } catch {
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
            setAppError({
                message: "Unable to sync profile. You can keep browsing and retry when ready.",
                retryLabel: "Retry sync",
            });
            lastRetryActionRef.current = () => syncUser();
            syncInFlightRef.current = false;
        }
    }, [applySyncedUser, clerkUser, isLoaded, isSignedIn, runDailyCheck]);

    // Sync Clerk user -> local state + DB
    useEffect(() => {
        if (isLoaded && isSignedIn && clerkUser && !dbSynced) {
            void syncUser();
        } else if (isLoaded && !isSignedIn) {
            queueMicrotask(() => {
                setUser(EMPTY_USER);
                setDbSynced(false);
                setSyncStatus("idle");
                setSyncError(null);
                setAppError(null);
                setIsRetryingAction(false);
                syncInFlightRef.current = false;
                enrollingCourseIdsRef.current.clear();
                lastRetryActionRef.current = null;
            });
        }
    }, [isLoaded, isSignedIn, clerkUser, dbSynced, syncUser]);

    const enrollCourse = useCallback((courseId: string) => {
        if (!courseId || enrollingCourseIdsRef.current.has(courseId)) return;

        const previousEnrolledCourses = user.enrolledCourses;
        enrollingCourseIdsRef.current.add(courseId);
        setAppError(null);

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
                    lastRetryActionRef.current = null;
                    setAppError(null);
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
                        lastRetryActionRef.current = null;
                        setAppError(null);
                    });
            })
            .catch(() => {
                setUser((prev) => ({
                    ...prev,
                    enrolledCourses: previousEnrolledCourses,
                }));
                setAppError({
                    message: "Enrollment failed. Your selection was rolled back.",
                    retryLabel: "Retry enroll",
                });
                lastRetryActionRef.current = () => {
                    enrollCourse(courseId);
                };
            })
            .finally(() => {
                enrollingCourseIdsRef.current.delete(courseId);
            });
    }, [applySyncedUser, user.enrolledCourses]);

    const completeExercise = useCallback((exerciseId: string, xpReward: number) => {
        let newCompleted: string[] = [];
        const newlyUnlockedBadges: Badge[] = [];

        setUser((prev) => {
            if (prev.completedExercises.includes(exerciseId)) {
                newCompleted = prev.completedExercises;
                return prev;
            }
            const newXP = prev.xp + xpReward;
            newCompleted = [...prev.completedExercises, exerciseId];
            const currentStreak = prev.streak;

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
                        unlocked = currentStreak >= badge.requirement.value;
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
                    const unlockedBadge = { ...badge, unlockedAt: new Date().toISOString() };
                    newBadges.push(unlockedBadge);
                    newlyUnlockedBadges.push(unlockedBadge);
                }
            });

            return {
                ...prev,
                xp: newXP,
                completedExercises: newCompleted,
                badges: newBadges,
                lastActive: new Date().toISOString(),
            };
        });

        if (newlyUnlockedBadges.length > 0) {
            setBadgeUnlockQueue((prev) => {
                const queuedIds = new Set(prev.map((badge) => badge.id));
                const deduped = newlyUnlockedBadges.filter((badge) => !queuedIds.has(badge.id));
                if (deduped.length === 0) {
                    return prev;
                }
                return [...prev, ...deduped];
            });
        }

        fetch("/api/user/complete-exercise", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                exerciseId,
                xpReward,
                newlyUnlockedBadgeIds: newlyUnlockedBadges.map((badge) => badge.id),
            }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    throw new Error("Exercise completion failed");
                }
                return res.json();
            })
            .then((payload) => {
                if (!payload) return;
                setUser((prev) => ({
                    ...prev,
                    xp: typeof payload.xp === "number" ? payload.xp : prev.xp,
                    streak: typeof payload.streak === "number" ? payload.streak : prev.streak,
                    lastActive:
                        typeof payload.lastActive === "string"
                            ? payload.lastActive
                            : prev.lastActive,
                }));
            })
            .catch(() => { });
    }, []);

    const dismissActiveBadgeUnlock = useCallback(() => {
        setBadgeUnlockQueue((prev) => prev.slice(1));
    }, []);

    const dismissAppError = useCallback(() => {
        setAppError(null);
        if (syncStatus !== "error") {
            setSyncError(null);
        }
    }, [syncStatus]);

    const retryLastAction = useCallback(() => {
        const retry = lastRetryActionRef.current;
        if (!retry || isRetryingAction) {
            return;
        }
        setIsRetryingAction(true);
        setAppError(null);
        Promise.resolve(retry()).finally(() => {
            setIsRetryingAction(false);
        });
    }, [isRetryingAction]);

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
                appError,
                isRetryingAction,
                activeBadgeUnlock: badgeUnlockQueue[0] ?? null,
                enrollCourse,
                completeExercise,
                dismissActiveBadgeUnlock,
                dismissAppError,
                retryLastAction,
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
