"use client";
import { useState, useEffect } from "react";
import { getUserById } from "@/actions/backend/user";
import { Iuser } from "@/types";

const useGetUser = (userId: string) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<Iuser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      return;
    }

    setLoading(true);
    setError(null);

    getUserById(userId)
      .then((res) => {
        setUser(res);
      })
      .catch(() => {
        setError("Failed to fetch user data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  return { user, loading, error };
};

export default useGetUser;
