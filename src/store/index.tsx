"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { User, Badge, Course } from "@/types";
export type { User, Badge, Course };
import { MOCK_USER, BADGES, COURSES } from "@/services/data";

interface AppState {
    user: User;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
    enrollCourse: (courseId: string) => void;
    completeExercise: (exerciseId: string, xpReward: number) => void;
    getUserProgress: (courseId: string) => { completed: number; total: number; percentage: number };
    isExerciseCompleted: (exerciseId: string) => boolean;
    updateSubscription: (plan: "free" | "pro") => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const { user: clerkUser, isSignedIn, isLoaded } = useClerkUser();
    const [user, setUser] = useState<User>(MOCK_USER);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [dbSynced, setDbSynced] = useState(false);

    // Sync Clerk user -> local state + DB
    useEffect(() => {
        if (isLoaded && isSignedIn && clerkUser && !dbSynced) {
            // Sync user to database
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
                .then((res) => res.json())
                .then((dbUser) => {
                    if (dbUser && dbUser.id) {
                        setUser({
                            ...MOCK_USER,
                            id: dbUser.id,
                            clerkId: clerkUser.id,
                            email: dbUser.email,
                            name: dbUser.name,
                            avatar: dbUser.avatar || "",
                            subscription: dbUser.subscription || "free",
                            xp: dbUser.xp || 0,
                            streak: dbUser.streak || 0,
                            enrolledCourses: dbUser.enrolledCourses || [],
                            completedExercises: dbUser.completedExercises || [],
                            badges: dbUser.badges || [],
                            referralCode: dbUser.referralCode || "",
                            referralCount: dbUser.referralCount || 0,
                        } as User);
                    }
                    setDbSynced(true);
                })
                .catch(() => {
                    // Fallback to mock user with clerk data
                    setUser({
                        ...MOCK_USER,
                        id: clerkUser.id,
                        email: clerkUser.primaryEmailAddress?.emailAddress || MOCK_USER.email,
                        name: clerkUser.fullName || clerkUser.firstName || MOCK_USER.name,
                        avatar: clerkUser.imageUrl || "",
                    });
                    setDbSynced(true);
                });
            setIsAuthenticated(true);
        } else if (isLoaded && !isSignedIn) {
            setIsAuthenticated(false);
            setDbSynced(false);
        }
    }, [isLoaded, isSignedIn, clerkUser, dbSynced]);

    const login = useCallback(() => {
        setIsAuthenticated(true);
    }, []);

    const logout = useCallback(() => {
        setIsAuthenticated(false);
    }, []);

    const enrollCourse = useCallback((courseId: string) => {
        // Optimistic update
        setUser((prev) => {
            if (prev.enrolledCourses.includes(courseId)) return prev;
            return {
                ...prev,
                enrolledCourses: [...prev.enrolledCourses, courseId],
            };
        });

        // Sync to DB
        fetch("/api/user/enroll", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ courseId }),
        }).catch(() => { });
    }, []);

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
        (courseId: string) => {
            const course = COURSES.find((c) => c.id === courseId);
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
                isAuthenticated,
                isLoading: !isLoaded,
                login,
                logout,
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
