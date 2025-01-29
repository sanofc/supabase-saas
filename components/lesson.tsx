"use client";
import React from "react";
import Link from "next/link";
import { useUser } from "@/context/user";

interface Lesson {
  id: string;
  title: string;
}

interface LessonProps {
  lessons: Lesson[];
}

export default function Lesson({ lessons }: LessonProps) {
  const { user } = useUser();
  console.log({ user });
  return (
    <div className="w-full max-w-3xl mx-auto my-16 px-2">
      {lessons?.map((lesson) => (
        <Link
          key={lesson.id}
          href={`/${lesson.id}`}
          className="p-8 h-40 mb-4 rounded shadow text-xl flex"
        >
          {lesson.title}
        </Link>
      ))}
    </div>
  );
}
