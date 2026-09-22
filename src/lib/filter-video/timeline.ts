export const BPM = 105;
export const BEAT = 60 / BPM;
export const BAR = BEAT * 4;
export const CROSSFADE = 0.48;
export const SONG_DURATION = 438.39;

export type ClipId =
  | "lab"
  | "walk"
  | "gel-face"
  | "darkroom"
  | "car"
  | "gels"
  | "prism"
  | "street"
  | "trays"
  | "windshield";

export type Grade = "none" | "amber" | "cyan" | "red" | "crush" | "bleach";

export type Shot = {
  start: number;
  end: number;
  clip: ClipId;
  grade: Grade;
};

export type TitleCue = {
  start: number;
  end: number;
  kind: "open" | "stamp" | "end";
};

export const CLIPS: Record<
  ClipId,
  { src: string; poster: string; duration: number }
> = {
  lab: { src: "/video/lab.mp4", poster: "/stills/lab.jpg", duration: 10.04 },
  walk: { src: "/video/walk.mp4", poster: "/stills/walk.jpg", duration: 10.04 },
  "gel-face": {
    src: "/video/gel-face.mp4",
    poster: "/stills/gel-face.jpg",
    duration: 6.04,
  },
  darkroom: {
    src: "/video/darkroom.mp4",
    poster: "/stills/darkroom.jpg",
    duration: 10,
  },
  car: { src: "/video/car.mp4", poster: "/stills/car.jpg", duration: 10 },
  gels: { src: "/video/gels.mp4", poster: "/stills/gels.jpg", duration: 10 },
  prism: { src: "/video/prism.mp4", poster: "/stills/prism.jpg", duration: 10 },
  street: {
    src: "/video/street.mp4",
    poster: "/stills/street.jpg",
    duration: 10,
  },
  trays: { src: "/video/trays.mp4", poster: "/stills/trays.jpg", duration: 10 },
  windshield: {
    src: "/video/windshield.mp4",
    poster: "/stills/windshield.jpg",
    duration: 10,
  },
};

export const CLIP_IDS = Object.keys(CLIPS) as ClipId[];

const b = (bars: number) => bars * BAR;

function shot(startBar: number, endBar: number, clip: ClipId, grade: Grade = "none"): Shot {
  return { start: b(startBar), end: b(endBar), clip, grade };
}

/** Cut on musical bars to the 7:18 mix of The Filter. */
export const SHOTS: Shot[] = [
  shot(0, 4, "gels", "amber"),
  shot(4, 8, "street", "cyan"),
  shot(8, 12, "walk"),
  shot(12, 16, "gel-face", "amber"),
  shot(16, 20, "lab"),
  shot(20, 24, "windshield", "cyan"),
  shot(24, 28, "prism"),
  shot(28, 32, "walk"),
  shot(32, 36, "darkroom", "red"),
  shot(36, 40, "gel-face"),
  shot(40, 44, "car"),
  shot(44, 48, "lab"),
  shot(48, 52, "gels"),
  shot(52, 56, "walk"),
  shot(56, 58, "prism", "bleach"),
  shot(58, 60, "gel-face", "amber"),
  shot(60, 62, "walk", "crush"),
  shot(62, 64, "prism"),
  shot(64, 68, "trays", "red"),
  shot(68, 72, "darkroom", "red"),
  shot(72, 76, "lab"),
  shot(76, 80, "gels"),
  shot(80, 84, "street"),
  shot(84, 88, "walk"),
  shot(88, 90, "prism", "bleach"),
  shot(90, 92, "gel-face"),
  shot(92, 96, "car"),
  shot(96, 100, "lab"),
  shot(100, 102, "prism"),
  shot(102, 104, "walk"),
  shot(104, 108, "windshield", "cyan"),
  shot(108, 112, "darkroom", "red"),
  shot(112, 114, "gel-face", "amber"),
  shot(114, 116, "prism", "bleach"),
  shot(116, 120, "street"),
  shot(120, 124, "walk"),
  shot(124, 128, "car"),
  shot(128, 132, "gels"),
  shot(132, 136, "lab"),
  shot(136, 140, "gel-face"),
  shot(140, 144, "walk"),
  shot(144, 152, "car"),
  shot(152, 160, "windshield", "cyan"),
  shot(160, 168, "lab"),
  shot(168, 176, "gels", "amber"),
  shot(176, 184, "darkroom", "red"),
  shot(184, 192, "street", "crush"),
];

export const TITLE_CUES: TitleCue[] = [
  { start: 0, end: b(4), kind: "open" },
  { start: b(56), end: b(60), kind: "stamp" },
  { start: b(84), end: b(88), kind: "stamp" },
  { start: b(184), end: b(192), kind: "end" },
];

export function shotIndexAt(time: number): number {
  const last = SHOTS.length - 1;
  for (let i = 0; i < SHOTS.length; i++) {
    if (time < SHOTS[i].end) return i;
  }
  return last;
}

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const s = Math.floor(seconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}
