"use client";
import { useEffect } from "react";
import { useUser } from "@/context/user";

const Logout = () => {
  const { logout } = useUser();
  useEffect(() => {
    logout();
  }, [logout]);

  return <p>Logging out</p>;
};

export default Logout;
