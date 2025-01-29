"use client";

import { useUser } from "@/context/user";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

const Login = () => {
  const { login } = useUser();
  useEffect(() => {
    login();
  }, []);

  return <p>Logging in</p>;
};

export default Login;
