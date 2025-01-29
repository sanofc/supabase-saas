import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useUser } from "@/context/user";
import Lesson from "@/components/lesson";

export default async function Home() {
  const supabase = await createClient();
  const { data: lessons } = await supabase.from("lesson").select("*");
  console.log(lessons);

  return <Lesson lessons={lessons || []} />;
}
