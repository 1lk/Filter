import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Pause, i as Play, n as Volume2, o as Maximize, t as VolumeX } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CGU6NP6q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var BAR = 60 / 105 * 4;
var CROSSFADE = .48;
var SONG_DURATION = 438.39;
var CLIPS = {
	lab: {
		src: "/video/lab.mp4",
		poster: "/stills/lab.jpg",
		duration: 10.04
	},
	walk: {
		src: "/video/walk.mp4",
		poster: "/stills/walk.jpg",
		duration: 10.04
	},
	"gel-face": {
		src: "/video/gel-face.mp4",
		poster: "/stills/gel-face.jpg",
		duration: 6.04
	},
	darkroom: {
		src: "/video/darkroom.mp4",
		poster: "/stills/darkroom.jpg",
		duration: 10
	},
	car: {
		src: "/video/car.mp4",
		poster: "/stills/car.jpg",
		duration: 10
	},
	gels: {
		src: "/video/gels.mp4",
		poster: "/stills/gels.jpg",
		duration: 10
	},
	prism: {
		src: "/video/prism.mp4",
		poster: "/stills/prism.jpg",
		duration: 10
	},
	street: {
		src: "/video/street.mp4",
		poster: "/stills/street.jpg",
		duration: 10
	},
	trays: {
		src: "/video/trays.mp4",
		poster: "/stills/trays.jpg",
		duration: 10
	},
	windshield: {
		src: "/video/windshield.mp4",
		poster: "/stills/windshield.jpg",
		duration: 10
	}
};
var CLIP_IDS = Object.keys(CLIPS);
var b = (bars) => bars * BAR;
function shot(startBar, endBar, clip, grade = "none") {
	return {
		start: b(startBar),
		end: b(endBar),
		clip,
		grade
	};
}
/** Cut on musical bars to the 7:18 mix of The Filter. */
var SHOTS = [
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
	shot(184, 192, "street", "crush")
];
var TITLE_CUES = [
	{
		start: 0,
		end: b(4),
		kind: "open"
	},
	{
		start: b(56),
		end: b(60),
		kind: "stamp"
	},
	{
		start: b(84),
		end: b(88),
		kind: "stamp"
	},
	{
		start: b(184),
		end: b(192),
		kind: "end"
	}
];
function shotIndexAt(time) {
	const last = SHOTS.length - 1;
	for (let i = 0; i < SHOTS.length; i++) if (time < SHOTS[i].end) return i;
	return last;
}
function formatTime(seconds) {
	if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
	const s = Math.floor(seconds);
	return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}
var AUDIO_SRC = "/audio/the-filter.mp3";
function MusicVideoPlayer() {
	const audioRef = (0, import_react.useRef)(null);
	const wrapRef = (0, import_react.useRef)(null);
	const videoRefs = (0, import_react.useRef)({});
	const analyserRef = (0, import_react.useRef)(null);
	const freqRef = (0, import_react.useRef)(null);
	const ctxRef = (0, import_react.useRef)(null);
	const hideTimer = (0, import_react.useRef)(0);
	const lastShot = (0, import_react.useRef)(0);
	const titleKindRef = (0, import_react.useRef)(null);
	const progressRef = (0, import_react.useRef)(null);
	const timeLabelRef = (0, import_react.useRef)(null);
	const timeRef = (0, import_react.useRef)(0);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [ended, setEnded] = (0, import_react.useState)(false);
	const [muted, setMuted] = (0, import_react.useState)(false);
	const [shotIndex, setShotIndex] = (0, import_react.useState)(0);
	const [duration, setDuration] = (0, import_react.useState)(SONG_DURATION);
	const [chromeOn, setChromeOn] = (0, import_react.useState)(true);
	const [started, setStarted] = (0, import_react.useState)(false);
	const [titleKind, setTitleKind] = (0, import_react.useState)("open");
	const current = SHOTS[shotIndex] ?? SHOTS[0];
	const armAudioGraph = (0, import_react.useCallback)(() => {
		const audio = audioRef.current;
		if (!audio || ctxRef.current) return;
		const ctx = new (window.AudioContext || window.webkitAudioContext)();
		const src = ctx.createMediaElementSource(audio);
		const analyser = ctx.createAnalyser();
		analyser.fftSize = 1024;
		analyser.smoothingTimeConstant = .78;
		src.connect(analyser);
		analyser.connect(ctx.destination);
		ctxRef.current = ctx;
		analyserRef.current = analyser;
		freqRef.current = new Uint8Array(analyser.frequencyBinCount);
	}, []);
	const showChrome = (0, import_react.useCallback)(() => {
		setChromeOn(true);
		window.clearTimeout(hideTimer.current);
		hideTimer.current = window.setTimeout(() => {
			if (audioRef.current && !audioRef.current.paused) setChromeOn(false);
		}, 2600);
	}, []);
	const applyShot = (0, import_react.useCallback)((index, songTime, snap = false) => {
		const shot = SHOTS[index];
		if (!shot) return;
		const clip = CLIPS[shot.clip];
		const offset = (songTime - shot.start) % clip.duration;
		const el = videoRefs.current[shot.clip];
		if (el) {
			if (snap || Math.abs(el.currentTime - offset) > .35) try {
				el.currentTime = Math.max(0, offset);
			} catch {}
			if (el.paused) el.play().catch(() => {});
		}
		CLIP_IDS.forEach((id) => {
			if (id === shot.clip) return;
			const other = videoRefs.current[id];
			if (other && !other.paused) window.setTimeout(() => {
				if (SHOTS[lastShot.current]?.clip !== id) other.pause();
			}, CROSSFADE * 1e3 + 80);
		});
	}, []);
	const play = (0, import_react.useCallback)(async () => {
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
	}, [
		armAudioGraph,
		applyShot,
		ended,
		showChrome
	]);
	const pause = (0, import_react.useCallback)(() => {
		audioRef.current?.pause();
		CLIP_IDS.forEach((id) => videoRefs.current[id]?.pause());
		setPlaying(false);
		setChromeOn(true);
	}, []);
	const toggle = (0, import_react.useCallback)(() => {
		if (playing) pause();
		else play();
	}, [
		play,
		pause,
		playing
	]);
	const paintTime = (t) => {
		timeRef.current = t;
		const progress = progressRef.current;
		if (progress && document.activeElement !== progress) progress.value = String(t);
		if (timeLabelRef.current) timeLabelRef.current.textContent = formatTime(t);
		const kind = TITLE_CUES.find((c) => t >= c.start && t < c.end)?.kind ?? null;
		if (kind !== titleKindRef.current) {
			titleKindRef.current = kind;
			setTitleKind(kind);
		}
	};
	const seek = (0, import_react.useCallback)((next) => {
		const audio = audioRef.current;
		if (!audio) return;
		const t = Math.min(Math.max(0, next), duration - .05);
		audio.currentTime = t;
		const idx = shotIndexAt(t);
		lastShot.current = idx;
		setShotIndex(idx);
		setEnded(false);
		paintTime(t);
		applyShot(idx, t, true);
	}, [applyShot, duration]);
	(0, import_react.useEffect)(() => {
		const audio = audioRef.current;
		if (!audio) return;
		const onReady = () => {
			if (Number.isFinite(audio.duration) && audio.duration > 0) setDuration(audio.duration);
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
	(0, import_react.useEffect)(() => {
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
					analyser.getByteFrequencyData(freq);
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
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const tag = e.target?.tagName;
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
			} else if (e.key === "m" || e.key === "M") setMuted((m) => !m);
			else if (e.key === "f" || e.key === "F") toggleFullscreen();
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
	const showStart = !started || ended && !playing;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrapRef,
		className: "relative h-dvh w-full overflow-hidden bg-bg text-fg select-none",
		onMouseMove: started ? showChrome : void 0,
		onTouchStart: started ? showChrome : void 0,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
				ref: audioRef,
				src: AUDIO_SRC,
				preload: "auto",
				muted
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "film-pulse absolute inset-0 origin-center will-change-transform",
				onClick: () => {
					if (started && !showStart) toggle();
				},
				children: [CLIP_IDS.map((id) => {
					const clip = CLIPS[id];
					const on = current.clip === id && started && !showStart;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						ref: (el) => {
							if (el) videoRefs.current[id] = el;
						},
						src: clip.src,
						poster: clip.poster,
						muted: true,
						loop: true,
						playsInline: true,
						preload: "auto",
						className: cn("clip-layer absolute inset-0 size-full object-cover", on && "is-on", on && `grade-${current.grade}`)
					}, id);
				}), !started && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/stills/lab.jpg",
					alt: "",
					className: "absolute inset-0 size-full object-cover grade-amber"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "vignette absolute inset-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "leak absolute inset-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grain-layer",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "letterbox absolute inset-x-0 top-0 z-10 bg-bg" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "letterbox absolute inset-x-0 bottom-0 z-10 bg-bg" }),
			started && !showStart && titleKind && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-0 z-20 flex items-center justify-center",
				children: [
					titleKind === "open" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpenTitle, {}),
					titleKind === "stamp" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StampTitle, {}),
					titleKind === "end" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EndTitle, {})
				]
			}),
			showStart && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 z-30 flex flex-col items-center justify-center px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-bg/55" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => void play(),
					className: "relative flex max-w-lg flex-col items-center text-center transition-opacity duration-150 ease-out active:scale-[0.96]",
					"aria-label": "Play The Filter",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GelMark, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-sans text-xs font-medium tracking-widest text-muted uppercase",
							children: "105 BPM"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 font-display text-3xl leading-tight tracking-display text-balance text-fg italic",
							children: "The Filter"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-sm text-sm leading-normal text-pretty text-muted",
							children: "A film for the song. Press play."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "play-ring mt-8 inline-flex size-16 items-center justify-center rounded-full bg-fg text-bg transition-transform duration-150 ease-out",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
								className: "size-6 translate-x-px",
								fill: "currentColor"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-4 text-xs tracking-caps text-subtle uppercase",
							children: "Play"
						})
					]
				})]
			}),
			started && !showStart && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-chrome": true,
				className: cn("chrome-fade player-chrome absolute inset-x-0 bottom-0 z-40 px-4 pt-16 sm:px-8", "bg-gradient-to-t from-bg/90 to-transparent", chromeOn ? "opacity-100" : "pointer-events-none opacity-0"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-5xl flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: progressRef,
						className: "progress-track w-full",
						type: "range",
						min: 0,
						max: duration,
						step: .01,
						defaultValue: 0,
						"aria-label": "Seek",
						onChange: (e) => seek(Number(e.target.value))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "inline-flex size-11 items-center justify-center rounded-md text-fg transition-transform duration-150 ease-out active:scale-[0.96]",
								"aria-label": playing ? "Pause" : "Play",
								onClick: toggle,
								children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {
									className: "size-5",
									fill: "currentColor"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
									className: "size-5 translate-x-px",
									fill: "currentColor"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "inline-flex size-11 items-center justify-center rounded-md text-fg transition-transform duration-150 ease-out active:scale-[0.96]",
								"aria-label": muted ? "Unmute" : "Mute",
								onClick: () => setMuted((m) => !m),
								children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-xs tabular-nums text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									ref: timeLabelRef,
									children: formatTime(0)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-subtle",
									children: [" / ", formatTime(duration)]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "ml-auto hidden font-display text-lg tracking-tight text-fg italic sm:block",
								children: "The Filter"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "ml-auto inline-flex size-11 items-center justify-center rounded-md text-fg sm:ml-2",
								"aria-label": "Fullscreen",
								onClick: () => void toggleFullscreen(),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize, { className: "size-4" })
							})
						]
					})]
				})
			})
		]
	});
}
function GelMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "mb-6 inline-flex h-8 w-16 items-end gap-1",
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gel-strip h-7 w-4 bg-accent/80" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gel-strip h-8 w-4 bg-cyan-gel/75" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gel-strip h-6 w-4 bg-red-gel/80" })
		]
	});
}
function OpenTitle() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center px-6 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium tracking-widest text-fg/70 uppercase",
			children: "A film"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-2 font-display text-3xl tracking-display text-fg italic",
			children: "The Filter"
		})]
	});
}
function StampTitle() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-display text-2xl tracking-tight text-fg/90 italic",
		children: "The Filter"
	});
}
function EndTitle() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center px-6 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-3xl tracking-display text-fg italic",
			children: "The Filter"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-xs tracking-caps text-muted uppercase",
			children: "105 BPM"
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MusicVideoPlayer, {});
}
//#endregion
export { Home as component };
