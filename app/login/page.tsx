"use client";

import { useUser } from "@/context/user";
import { useEffect } from "react";

const Login = () => {
  const { login } = useUser();
  useEffect(() => {
    login();
  }, [login]);

  return <p>Logging in</p>;
};

export default Login;
