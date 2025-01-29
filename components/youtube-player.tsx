// app/youtube-player.tsx
"use client";

import React from "react";
import ReactPlayer from "react-player";

type YouTubePlayerProps = {
  url: string;
};

export default function YouTubePlayer({ url }: YouTubePlayerProps) {
  return (
    <div
      style={{ position: "relative", paddingTop: "56.25%" /* 16:9 ratio */ }}
    >
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0 }}
        controls
      />
    </div>
  );
}
