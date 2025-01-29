import Dashboard from "@/components/dashboard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

export const Page = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);

  if (!user) {
    redirect("/login");
  }
  return <Dashboard />;
};

export default Page;
