import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BAR,
  CLIP_IDS,
  CLIPS,
  CROSSFADE,
  SONG_DURATION,
  SHOTS,
  TITLE_CUES,
  type ClipId,
  formatTime,
  shotIndexAt,
} from "@/lib/filter-video/timeline";

const AUDIO_SRC = "/audio/the-filter.mp3";

export function MusicVideoPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Partial<Record<ClipId, HTMLVideoElement>>>({});
  const analyserRef = useRef<AnalyserNode | null>(null);
  const freqRef = useRef<Uint8Array | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const hideTimer = useRef<number>(0);
  const lastShot = useRef(0);
  const titleKindRef = useRef<"open" | "stamp" | "end" | null>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const timeLabelRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef(0);

  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [shotIndex, setShotIndex] = useState(0);
  const [duration, setDuration] = useState(SONG_DURATION);
  const [chromeOn, setChromeOn] = useState(true);
  const [started, setStarted] = useState(false);
  const [titleKind, setTitleKind] = useState<"open" | "stamp" | "end" | null>("open");

  const current = SHOTS[shotIndex] ?? SHOTS[0];

  const armAudioGraph = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || ctxRef.current) return;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const src = ctx.createMediaElementSource(audio);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.78;
    src.connect(analyser);
    analyser.connect(ctx.destination);
    ctxRef.current = ctx;
    analyserRef.current = analyser;
    freqRef.current = new Uint8Array(analyser.frequencyBinCount);
  }, []);

  const showChrome = useCallback(() => {
    setChromeOn(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (audioRef.current && !audioRef.current.paused) setChromeOn(false);
    }, 2600);
  }, []);

  const applyShot = useCallback((index: number, songTime: number, snap = false) => {
    const shot = SHOTS[index];
    if (!shot) return;
    const clip = CLIPS[shot.clip];
    const offset = (songTime - shot.start) % clip.duration;
    const el = videoRefs.current[shot.clip];
    if (el) {
      if (snap || Math.abs(el.currentTime - offset) > 0.35) {
        try {
          el.currentTime = Math.max(0, offset);
        } catch {
          /* ignore seek abort */
        }
      }
      if (el.paused) void el.play().catch(() => {});
    }
    CLIP_IDS.forEach((id) => {
      if (id === shot.clip) return;
      const other = videoRefs.current[id];
      if (other && !other.paused) {
        window.setTimeout(() => {
          const stillOff = SHOTS[lastShot.current]?.clip !== id;
          if (stillOff) other.pause();
        }, CROSSFADE * 1000 + 80);
      }
    });
  }, []);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    armAudioGraph();
    await ctxRef.current?.resume();
    if (ended) {
      audio.currentTime = 0;
      setShotIndex(0);
      lastShot.current = 0;
      setEnded(false);
      setTitleKind("open");
      titleKindRef.current = "open";
    }
    await audio.play();
    setStarted(true);
    setPlaying(true);
    applyShot(lastShot.current, audio.currentTime, true);
    showChrome();
  }, [armAudioGraph, applyShot, ended, showChrome]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    CLIP_IDS.forEach((id) => videoRefs.current[id]?.pause());
    setPlaying(false);
    setChromeOn(true);
  }, []);

  const toggle = useCallback(() => {
    if (playing) pause();
    else void play();
  }, [play, pause, playing]);

  const paintTime = (t: number) => {
    timeRef.current = t;
    const progress = progressRef.current;
    if (progress && document.activeElement !== progress) {
      progress.value = String(t);
    }
    if (timeLabelRef.current) {
      timeLabelRef.current.textContent = formatTime(t);
    }
    const cue = TITLE_CUES.find((c) => t >= c.start && t < c.end);
    const kind = cue?.kind ?? null;
    if (kind !== titleKindRef.current) {
      titleKindRef.current = kind;
      setTitleKind(kind);
    }
  };

  const seek = useCallback(
    (next: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      const t = Math.min(Math.max(0, next), duration - 0.05);
      audio.currentTime = t;
      const idx = shotIndexAt(t);
      lastShot.current = idx;
      setShotIndex(idx);
      setEnded(false);
      paintTime(t);
      applyShot(idx, t, true);
    },
    [applyShot, duration],
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onReady = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };
    const onEnded = () => {
      setPlaying(false);
      setEnded(true);
      setChromeOn(true);
      CLIP_IDS.forEach((id) => videoRefs.current[id]?.pause());
    };
    audio.addEventListener("canplaythrough", onReady);
    audio.addEventListener("loadedmetadata", onReady);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("canplaythrough", onReady);
      audio.removeEventListener("loadedmetadata", onReady);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        const t = audio.currentTime;
        paintTime(t);
        const idx = shotIndexAt(t);
        if (idx !== lastShot.current) {
          lastShot.current = idx;
          setShotIndex(idx);
          applyShot(idx, t, true);
        }
        const analyser = analyserRef.current;
        const freq = freqRef.current;
        const wrap = wrapRef.current;
        if (analyser && freq && wrap) {
          analyser.getByteFrequencyData(freq as unknown as Uint8Array<ArrayBuffer>);
          let bass = 0;
          for (let i = 1; i < 8; i++) bass += freq[i];
          const pulse = Math.min(1, (bass / 8 - 40) / 180);
          wrap.style.setProperty("--pulse", pulse.toFixed(3));
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [applyShot]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        toggle();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        seek(timeRef.current + BAR);
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        seek(timeRef.current - BAR);
      } else if (e.key === "m" || e.key === "M") {
        setMuted((m) => !m);
      } else if (e.key === "f" || e.key === "F") {
        void toggleFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, seek]);

  const toggleFullscreen = async () => {
    const node = wrapRef.current;
    if (!node) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await node.requestFullscreen().catch(() => {});
  };

  const showStart = !started || (ended && !playing);

  return (
    <div
      ref={wrapRef}
      className="relative h-dvh w-full overflow-hidden bg-bg text-fg select-none"
      onMouseMove={started ? showChrome : undefined}
      onTouchStart={started ? showChrome : undefined}
    >
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" muted={muted} />

      <div
        className="film-pulse absolute inset-0 origin-center will-change-transform"
        onClick={() => {
          if (started && !showStart) toggle();
        }}
      >
        {CLIP_IDS.map((id) => {
          const clip = CLIPS[id];
          const on = current.clip === id && started && !showStart;
          return (
            <video
              key={id}
              ref={(el) => {
                if (el) videoRefs.current[id] = el;
              }}
              src={clip.src}
              poster={clip.poster}
              muted
              loop
              playsInline
              preload="auto"
              className={cn(
                "clip-layer absolute inset-0 size-full object-cover",
                on && "is-on",
                on && `grade-${current.grade}`,
              )}
            />
          );
        })}
        {!started && (
          <img
            src="/stills/lab.jpg"
            alt=""
            className="absolute inset-0 size-full object-cover grade-amber"
          />
        )}
      </div>

      <div className="vignette absolute inset-0" />
      <div className="leak absolute inset-0" />
      <div className="grain-layer" aria-hidden />

      <div className="letterbox absolute inset-x-0 top-0 z-10 bg-bg" />
      <div className="letterbox absolute inset-x-0 bottom-0 z-10 bg-bg" />

      {started && !showStart && titleKind && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          {titleKind === "open" && <OpenTitle />}
          {titleKind === "stamp" && <StampTitle />}
          {titleKind === "end" && <EndTitle />}
        </div>
      )}

      {showStart && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6">
          <div className="absolute inset-0 bg-bg/55" />
          <button
            type="button"
            onClick={() => void play()}
            className="relative flex max-w-lg flex-col items-center text-center transition-opacity duration-150 ease-out active:scale-[0.96]"
            aria-label="Play The Filter"
          >
            <GelMark />
            <p className="font-sans text-xs font-medium tracking-widest text-muted uppercase">
              105 BPM
            </p>
            <h1 className="mt-3 font-display text-3xl leading-tight tracking-display text-balance text-fg italic">
              The Filter
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-normal text-pretty text-muted">
              A film for the song. Press play.
            </p>
            <span className="play-ring mt-8 inline-flex size-16 items-center justify-center rounded-full bg-fg text-bg transition-transform duration-150 ease-out">
              <Play className="size-6 translate-x-px" fill="currentColor" />
            </span>
            <span className="mt-4 text-xs tracking-caps text-subtle uppercase">Play</span>
          </button>
        </div>
      )}

      {started && !showStart && (
      <div
        data-chrome
        className={cn(
          "chrome-fade player-chrome absolute inset-x-0 bottom-0 z-40 px-4 pt-16 sm:px-8",
          "bg-gradient-to-t from-bg/90 to-transparent",
          chromeOn ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-3">
          <input
            ref={progressRef}
            className="progress-track w-full"
            type="range"
            min={0}
            max={duration}
            step={0.01}
            defaultValue={0}
            aria-label="Seek"
            onChange={(e) => seek(Number(e.target.value))}
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-md text-fg transition-transform duration-150 ease-out active:scale-[0.96]"
              aria-label={playing ? "Pause" : "Play"}
              onClick={toggle}
            >
              {playing ? (
                <Pause className="size-5" fill="currentColor" />
              ) : (
                <Play className="size-5 translate-x-px" fill="currentColor" />
              )}
            </button>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-md text-fg transition-transform duration-150 ease-out active:scale-[0.96]"
              aria-label={muted ? "Unmute" : "Mute"}
              onClick={() => setMuted((m) => !m)}
            >
              {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
            </button>
            <p className="font-mono text-xs tabular-nums text-muted">
              <span ref={timeLabelRef}>{formatTime(0)}</span>
              <span className="text-subtle"> / {formatTime(duration)}</span>
            </p>
            <p className="ml-auto hidden font-display text-lg tracking-tight text-fg italic sm:block">
              The Filter
            </p>
            <button
              type="button"
              className="ml-auto inline-flex size-11 items-center justify-center rounded-md text-fg sm:ml-2"
              aria-label="Fullscreen"
              onClick={() => void toggleFullscreen()}
            >
              <Maximize className="size-4" />
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

function GelMark() {
  return (
    <span className="mb-6 inline-flex h-8 w-16 items-end gap-1" aria-hidden>
      <span className="gel-strip h-7 w-4 bg-accent/80" />
      <span className="gel-strip h-8 w-4 bg-cyan-gel/75" />
      <span className="gel-strip h-6 w-4 bg-red-gel/80" />
    </span>
  );
}

function OpenTitle() {
  return (
    <div className="flex flex-col items-center px-6 text-center">
      <p className="text-xs font-medium tracking-widest text-fg/70 uppercase">A film</p>
      <h2 className="mt-2 font-display text-3xl tracking-display text-fg italic">
        The Filter
      </h2>
    </div>
  );
}

function StampTitle() {
  return (
    <p className="font-display text-2xl tracking-tight text-fg/90 italic">The Filter</p>
  );
}

function EndTitle() {
  return (
    <div className="flex flex-col items-center px-6 text-center">
      <h2 className="font-display text-3xl tracking-display text-fg italic">The Filter</h2>
      <p className="mt-3 text-xs tracking-caps text-muted uppercase">105 BPM</p>
    </div>
  );
}
