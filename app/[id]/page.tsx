import YouTubePlayer from "@/components/youtube-player";
import { createClient } from "@/utils/supabase/server";

// export async function generateStaticParams() {
//   // データベースから全てのレッスンIDを取得
//   const supabase = await createClient();
//   const { data: lessons } = await supabase.from("lesson").select("id");

//   if (!lessons) {
//     return [];
//   }
//   return lessons.map(({ id }) => ({
//     id: id.toString(),
//   }));
// }

async function fetchLesson(id: string) {
  const supabase = await createClient();
  const { data: lesson } = await supabase
    .from("lesson")
    .select("*")
    .eq("id", id)
    .single();
  return lesson;
}

async function getPremiumContent(lesson: { id: string }) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("premium_content")
    .select("video_url")
    .eq("id", lesson.id)
    .single();
  return data?.video_url;
}

export default async function LessonDetails({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  console.log(id);
  const lesson = await fetchLesson(id);
  console.log(lesson);
  const video_url = await getPremiumContent(lesson);
  console.log(video_url);

  return (
    <div className="w-full max-w-3xl mx-auto my-16 px-2">
      <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
      <p className="text-lg">{lesson.description}</p>
      {video_url && <YouTubePlayer url={video_url} />}
    </div>
  );
}
