"use client";

import { useCallback, useEffect, useState } from "react";

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string | null;
  xp: number;
  streak: number;
  rank: number;
}

interface LeaderboardResponse {
  topUsers: LeaderboardEntry[];
  currentUser: LeaderboardEntry | null;
}

export function useLeaderboard() {
  const [topUsers, setTopUsers] = useState<LeaderboardEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user/leaderboard", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }

      const payload = (await response.json()) as LeaderboardResponse;

      setTopUsers(Array.isArray(payload.topUsers) ? payload.topUsers : []);
      setCurrentUser(payload.currentUser ?? null);
    } catch {
      setError("Unable to load leaderboard right now.");
      setTopUsers([]);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    topUsers,
    currentUser,
    loading,
    error,
    refresh: fetchLeaderboard,
  };
}
