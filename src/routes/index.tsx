import { createFileRoute } from "@tanstack/react-router";
import { MusicVideoPlayer } from "@/components/filter-video/player";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <MusicVideoPlayer />;
}
