"use client";
import { useState } from "react";

export const useLoadMore = <T>(
  items: T[],
  initialCount = 20,
  increment = 10
) => {
  const [visibleItems, setVisibleItems] = useState<number>(initialCount);
  const [loading, setLoading] = useState<boolean>(false);

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setVisibleItems((prev) => prev + increment);
    setLoading(false);
  };

  const hasMore = visibleItems < items.length;

  return {
    visibleItems: items.slice(0, visibleItems),
    loadMore,
    hasMore,
    loading,
  };
};
