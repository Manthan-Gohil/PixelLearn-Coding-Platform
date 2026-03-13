"use client";

import { useCallback, useState } from "react";
import type { AIToolRequestType } from "@/types/ai-tools";

export function useAIApi() {
  const [isLoading, setIsLoading] = useState(false);

  const callAI = useCallback(
    async (type: AIToolRequestType, data: Record<string, unknown>) => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, data }),
        });
        const result = await response.json();
        return result.result;
      } catch {
        return "Error: Unable to process request. Please try again.";
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { isLoading, callAI };
}
