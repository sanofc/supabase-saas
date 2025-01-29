"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";
import { UserResponse } from "@supabase/supabase-js";

import { ReactNode } from "react";

interface UserContextType {
  user: any | undefined;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const Context = createContext<UserContextType | null>(null);

const Provider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<UserResponse | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getUserProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profile")
          .select("*")
          .eq("id", user?.id)
          .single();
        setUser({
          ...user,
          ...profile,
        });
      }
      setIsLoading(false);
    };

    supabase.auth.onAuthStateChange(() => {
      getUserProfile();
    });
  }, []);

  useEffect(() => {
    if (user) {
      const channel = supabase
        .channel("realtime profile")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "profile",
          },
          (payload) => {
            console.log("Change received!", payload);

            setUser({ ...user, ...payload.new });
          }
        )
        .subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${process.env.CLIENT_URL}/auth/callback`,
      },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(undefined);
    router.push("/");
  };

  const exposed: UserContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};

export default Provider;
