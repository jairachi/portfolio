import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
	PROJECTS,
	CREDIT,
	ORIGINAL_AUTHOR,
	STATUS,
	LINK_STYLE,
} from "../data/projects";

/* ============================================================================
   Projects page
   ----------------------------------------------------------------------------
   Sections (top to bottom):
     1. Fixed background  – dark gradient + slowly spinning SAO tech circle
     2. Header            – back button + page title
     3. Carousel          – browses the projects marked  featured: true
     4. Project cards     – every project, with All / Completed / In Progress filter
     5. Footer            – asset credit + fan-made disclaimer

   To add or change projects, edit  src/data/projects.js  (not this file).
   ============================================================================ */

// Vite sets BASE_URL from the `base` option in vite.config.js. On GitHub Pages
// that is usually "/your-repo-name/", so we prefix every public/ asset with it.
const BASE = import.meta.env.BASE_URL;
const asset = (path) => (/^https?:\/\//.test(path) ? path : `${BASE}${path}`);

// ---- Side menu items. `id` must match the id of the section it points to. ----
// `icon` is a file name in public/sao/icons/ (without .svg). Swap it for any other icon you like.
const NAV = [
	{ id: "featured", icon: "equipment", label: "Featured" },
	{ id: "browse", icon: "searching", label: "Browse" },
];

const FOCUS =
	"focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EBA601]";

// Round SAO icon. The orange "_on" version fades in when `on` is true,
// or when the parent link (class "group") is hovered or focused.
function Icon({ name, on, className = "h-14 w-14" }) {
	return (
		<span className={`relative inline-block shrink-0 ${className}`}>
			<img
				src={`${BASE}sao/icons/${name}.svg`}
				alt=""
				className="absolute inset-0 h-full w-full"
			/>
			<img
				src={`${BASE}sao/icons/${name}_on.svg`}
				alt=""
				className={`absolute inset-0 h-full w-full transition-opacity ${
					on
						? "opacity-100"
						: "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
				}`}
			/>
		</span>
	);
}

/* ---------------------------------------------------------------------------
   Small CSS block: things Tailwind utilities can't express on their own
   (font-face, keyframes, notched corners). Safe to keep even if your Home page
   already declares the same fonts.
   --------------------------------------------------------------------------- */
const PAGE_CSS = `
@font-face { font-family: 'SAO UI'; src: url('${BASE}sao/fonts/saouitt-regular.ttf') format('truetype'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'SAO UI'; src: url('${BASE}sao/fonts/saouitt-bold.ttf') format('truetype'); font-weight: 700; font-display: swap; }
@font-face { font-family: 'SAO Welcome'; src: url('${BASE}sao/fonts/saowelcomett-regular.ttf') format('truetype'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'SAO Welcome'; src: url('${BASE}sao/fonts/saowelcomett-bold.ttf') format('truetype'); font-weight: 700; font-display: swap; }

.sao-ui    { font-family: 'SAO UI', 'Segoe UI', system-ui, sans-serif; }
.sao-title { font-family: 'SAO Welcome', 'SAO UI', 'Segoe UI', system-ui, sans-serif; }

html { scroll-behavior: smooth; }

@keyframes sao-spin { to { transform: translate(-50%, -50%) rotate(360deg); } }
.sao-ring { animation: sao-spin 120s linear infinite; }

/* Notched (cut-corner) shape used by the cards, carousel and buttons */
.sao-notch   { clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px); }
.sao-notch-s { clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px); }

/* Cards fade + slide up when a list appears (delay is set per card in JSX) */
@keyframes sao-fade-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
.sao-fade-up { animation: sao-fade-up 500ms ease-out both; }

/* Carousel timer bar: grows from 0 to 100% over the slide time */
@keyframes sao-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.sao-progress { transform-origin: left; animation: sao-progress 7000ms linear both; }

@media (prefers-reduced-motion: reduce) {
  .sao-fade-up { animation: none; }
  .sao-progress { display: none; }
  .sao-ring { animation: none; }
  html { scroll-behavior: auto; }
}
`;

/* ============================================================================
   Small reusable pieces
   ============================================================================ */

// Coloured "Completed" / "In Progress" pill
function StatusTag({ status }) {
	const s = STATUS[status] ?? STATUS.completed;
	return (
		<span
			className="sao-ui inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-bold uppercase tracking-widest"
			style={{
				color: s.color,
				borderColor: s.color,
				background: `${s.color}1a`,
			}}
		>
			<span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
			{s.label}
		</span>
	);
}

// Row of small tech labels
function TagList({ tags = [] }) {
	if (!tags.length) return null;
	return (
		<ul className="flex flex-wrap justify-center gap-2 lg:justify-start">
			{tags.map((t) => (
				<li
					key={t}
					className="sao-ui rounded border border-white/20 bg-white/5 px-2.5 py-0.5 text-sm text-slate-200"
				>
					{t}
				</li>
			))}
		</ul>
	);
}

// Image with a graceful placeholder when no image has been set yet
function ProjectImage({ project, className = "" }) {
	if (!project.image) {
		return (
			<div
				className={`flex items-center justify-center bg-gradient-to-br from-[#0b2a4a] via-[#123b66] to-[#3a2a08] ${className}`}
			>
				<img
					src={`${BASE}sao/icons/one-handed-straight-sword_on.svg`}
					alt=""
					className="h-24 w-24 opacity-70"
				/>
			</div>
		);
	}
	// The wrapper div owns the size (set through className). The <img> is
	// absolutely positioned inside it, so the image can NEVER make the frame
	// bigger: it is cropped (object-cover) or letterboxed (object-contain).
	return (
		<div className={`relative overflow-hidden bg-[#0b1220] ${className}`}>
			<img
				src={asset(project.image)}
				alt={`${project.title} cover`}
				loading="lazy"
				className={`absolute inset-0 h-full w-full ${
					project.imageFit === "contain" ? "object-contain" : "object-cover"
				}`}
				style={{ objectPosition: project.imagePosition ?? "center" }}
			/>
		</div>
	);
}

// One button per entry in project.links
function LinkButtons({ links = [], tabbable = true, align = "center" }) {
	return (
		<div
			className={`flex flex-wrap gap-3 ${
				align === "center"
					? "justify-center"
					: "justify-center lg:justify-start"
			}`}
		>
			{links.map((l) => {
				const style = LINK_STYLE[l.type] ?? LINK_STYLE.other;
				return (
					<a
						key={l.url + l.label}
						href={l.url}
						target="_blank"
						rel="noopener noreferrer"
						tabIndex={tabbable ? 0 : -1}
						className="sao-notch-s sao-ui inline-block px-6 py-3 text-lg font-bold uppercase tracking-wider transition hover:brightness-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
						style={{ background: style.bg, color: style.text }}
					>
						{l.label}
					</a>
				);
			})}
		</div>
	);
}

/* ============================================================================
   Carousel
   ----------------------------------------------------------------------------
   All slides are stacked in the SAME grid cell. Only the active one has
   opacity-100, so switching = a smooth cross-fade, and the box is always as
   tall as the tallest slide (no layout jumping).
   ============================================================================ */
const SLIDE_MS = 7000; // time each featured project stays on screen (7 seconds)

function Carousel({ slides, onBrowseAll }) {
	const [index, setIndex] = useState(0);
	const touchStartX = useRef(null);
	const count = slides.length;

	const go = useCallback(
		(n) => setIndex(((n % count) + count) % count),
		[count],
	);

	// Auto-advance: wait SLIDE_MS, then show the next slide.
	// `index` is a dependency, so whenever the slide changes (by timer OR by a
	// click/swipe/key) the old timer is cancelled and a fresh countdown starts.
	// It never pauses on hover or focus, so it keeps going on its own.
	useEffect(() => {
		if (count < 2) return;
		const reduce = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		if (reduce) return;
		const timer = setTimeout(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
		return () => clearTimeout(timer);
	}, [index, count]);

	if (!count) return null;

	return (
		<section
			aria-roledescription="carousel"
			id="featured"
			aria-label="Featured projects"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === "ArrowLeft") go(index - 1);
				if (e.key === "ArrowRight") go(index + 1);
			}}
			onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
			onTouchEnd={(e) => {
				if (touchStartX.current == null) return;
				const dx = e.changedTouches[0].clientX - touchStartX.current;
				if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
				touchStartX.current = null;
			}}
			className="relative outline-none [scroll-margin-top:2rem]"
		>
			{/* Orange border = wrapper background, dark panel = inner box */}
			<div className="sao-notch bg-gradient-to-br from-[#EBA601] via-[#EBA601]/60 to-[#3278BE] p-[3px]">
				<div className="sao-notch bg-[#080e1a]/95">
					<div className="grid">
						{slides.map((p, i) => {
							const active = i === index;
							return (
								<article
									key={p.id}
									aria-hidden={!active}
									aria-label={`${i + 1} of ${count}`}
									className={`col-start-1 row-start-1 grid items-stretch transition-opacity duration-700 lg:grid-cols-5 ${
										active ? "opacity-100" : "pointer-events-none opacity-0"
									}`}
								>
									<ProjectImage
										project={p}
										className="h-64 w-full sm:h-80 lg:col-span-3 lg:h-auto lg:min-h-[420px]"
									/>

									<div className="flex flex-col justify-center gap-5 p-6 text-center sm:p-10 lg:col-span-2 lg:text-left">
										<StatusTag status={p.status} />
										<h2 className="sao-title text-3xl font-bold leading-tight text-white sm:text-4xl xl:text-5xl">
											{p.title}
										</h2>
										<p className="sao-ui text-xl text-[#EBA601] xl:text-2xl">
											{p.tagline}
										</p>
										<TagList tags={p.tags} />
										<LinkButtons
											links={p.links}
											tabbable={active}
											align="start"
										/>
									</div>
								</article>
							);
						})}
					</div>
				</div>
			</div>

			{/* Timer bar: restarts (via key) every time the slide changes */}
			{count > 1 && (
				<div className="mt-4 h-[3px] w-full bg-white/10">
					<div
						key={index}
						className="sao-progress h-full bg-[#EBA601]"
						style={{ animationDuration: `${SLIDE_MS}ms` }}
					/>
				</div>
			)}

			{/* Dots + browse button */}
			<div className="mt-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
				<div className="flex items-center gap-4">
					{/* Previous arrow (a rotated square corner = chevron) */}
					<button
						type="button"
						aria-label="Previous project"
						onClick={() => go(index - 1)}
						className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white transition hover:border-[#EBA601] hover:text-[#EBA601]"
					>
						<span className="-mr-1 inline-block h-3 w-3 rotate-45 border-b-2 border-l-2 border-current" />
					</button>

					{/* Dots: the active one stretches into a pill */}
					<div
						className="flex items-center gap-3"
						role="tablist"
						aria-label="Choose project"
					>
						{slides.map((p, i) => (
							<button
								key={p.id}
								type="button"
								role="tab"
								aria-selected={i === index}
								aria-label={`Show ${p.title}`}
								onClick={() => go(i)}
								className={`h-3.5 rounded-full transition-all ${
									i === index
										? "w-10 bg-[#EBA601]"
										: "w-3.5 bg-white/30 hover:bg-white/60"
								}`}
							/>
						))}
					</div>

					{/* Next arrow */}
					<button
						type="button"
						aria-label="Next project"
						onClick={() => go(index + 1)}
						className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white transition hover:border-[#EBA601] hover:text-[#EBA601]"
					>
						<span className="-ml-1 inline-block h-3 w-3 -rotate-45 border-b-2 border-r-2 border-current" />
					</button>
				</div>
				<button
					type="button"
					onClick={onBrowseAll}
					className="sao-ui flex items-center gap-3 text-lg font-bold uppercase tracking-widest text-slate-200 transition hover:text-[#EBA601]"
				>
					Browse all projects
					<span className="inline-block h-3 w-3 rotate-45 border-b-2 border-r-2 border-current" />
				</button>
			</div>
		</section>
	);
}

/* ============================================================================
   Project card (the grid section)
   ----------------------------------------------------------------------------
   Layout mirrors your reference screenshot: image on top, dark body, centred
   title + text, button pinned to the bottom (mt-auto) so every button lines up
   even when descriptions have different lengths.
   ============================================================================ */
function ProjectCard({ project }) {
	return (
		<article className="sao-notch group flex-1 bg-white/25 p-[2px] transition-colors duration-300 hover:bg-[#EBA601]">
			<div className="sao-notch flex h-full flex-col bg-[#121722]">
				<ProjectImage project={project} className="aspect-[16/10] w-full" />

				<div className="flex flex-1 flex-col items-center gap-4 p-6 text-center">
					<StatusTag status={project.status} />
					<h3 className="sao-title text-2xl font-bold text-white xl:text-3xl">
						{project.title}
					</h3>
					<p className="sao-ui whitespace-pre-line text-lg leading-relaxed text-slate-300">
						{project.description}
					</p>
					<TagList tags={project.tags} />
					<div className="mt-auto w-full pt-4">
						<LinkButtons links={project.links} />
					</div>
				</div>
			</div>
		</article>
	);
}

/* ============================================================================
   The page itself
   ============================================================================ */
const FILTERS = [
	{ key: "all", label: "All" },
	{ key: "completed", label: "Completed" },
	{ key: "in-progress", label: "In Progress" },
];

export default function Projects() {
	const [filter, setFilter] = useState("all"); // which button is highlighted
	const [shownFilter, setShownFilter] = useState("all"); // which list is on screen
	const [leaving, setLeaving] = useState(false); // true while the old list fades out
	const gridRef = useRef(null);
	const timer = useRef(null);
	const [active, setActive] = useState("featured"); // which menu icon is lit

	// Light up the menu icon of the section that is currently on screen
	useEffect(() => {
		const io = new IntersectionObserver(
			(entries) =>
				entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
			{ rootMargin: "-40% 0px -55% 0px" }, // only a thin band around the middle of the screen counts
		);
		NAV.forEach((n) => {
			const el = document.getElementById(n.id);
			if (el) io.observe(el);
		});
		return () => io.disconnect();
	}, []);

	// Click a filter: highlight it now, fade the old list out (250 ms),
	// then swap in the new list, which fades in card by card.
	const changeFilter = (key) => {
		if (key === filter) return;
		setFilter(key);
		setLeaving(true);
		clearTimeout(timer.current);
		timer.current = setTimeout(() => {
			setShownFilter(key);
			setLeaving(false);
		}, 250);
	};
	useEffect(() => () => clearTimeout(timer.current), []);

	// Carousel shows featured projects; if none are marked, fall back to the first 3
	const slides = useMemo(() => {
		const featured = PROJECTS.filter((p) => p.featured);
		return featured.length ? featured : PROJECTS.slice(0, 3);
	}, []);

	const visible = PROJECTS.filter(
		(p) => shownFilter === "all" || p.status === shownFilter,
	);

	const scrollToGrid = () =>
		gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

	return (
		<div className="sao-ui relative min-h-screen text-slate-100">
			<style>{PAGE_CSS}</style>

			{/* 1. FIXED BACKGROUND — stays put while the content scrolls */}
			<div
				aria-hidden
				className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#050810]"
			>
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#0f2744_0%,#070c18_55%,#03050a_100%)]" />
				<img
					src={`${BASE}sao/ui/tech-circle.svg`}
					alt=""
					className="sao-ring absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] max-w-none opacity-[0.14]"
					style={{ transform: "translate(-50%, -50%)" }}
				/>
			</div>

			{/* SIDE MENU: tucked at the left edge on desktop (slides out on hover),
          a bottom bar on phones. Same behaviour as the Home page menu. */}
			<nav
				aria-label="Sections"
				className="fixed bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-3 rounded-full bg-[#070F24]/80 p-2 backdrop-blur transition-transform duration-300 ease-out motion-reduce:transition-none md:bottom-auto md:left-0 md:top-1/2 md:-translate-y-1/2 md:translate-x-[calc(-100%+18px)] md:flex-col md:rounded-l-none md:pl-4 md:hover:translate-x-0 md:focus-within:translate-x-0"
			>
				{NAV.map((n) => (
					<a
						key={n.id}
						href={`#${n.id}`}
						aria-label={n.label}
						className={`group relative rounded-full ${FOCUS}`}
					>
						<Icon name={n.icon} on={active === n.id} />
						<span className="pointer-events-none absolute left-full top-1/2 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-sm bg-white px-4 py-2 text-lg font-bold text-[#3C4350] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 md:block">
							{n.label}
						</span>
					</a>
				))}
			</nav>

			<div className="relative z-10">
				{/* 2. HEADER */}
				<header className="mx-auto flex max-w-[1600px] items-center justify-between px-6 pt-8 sm:px-10">
					<Link
						to="/"
						className="group flex items-center gap-3 text-lg font-bold uppercase tracking-widest text-slate-200 transition hover:text-[#EBA601]"
					>
						<img
							src={`${BASE}sao/icons/start_on.svg`}
							alt=""
							className="h-10 w-10 transition group-hover:scale-110"
						/>
						Home
					</Link>
					<span className="hidden text-lg uppercase tracking-widest text-slate-400 sm:block">
						Menu &gt; Projects
					</span>
				</header>

				<main className="mx-auto max-w-[1600px] px-6 pb-28 sm:px-10 md:pb-24">
					<div className="py-12 text-center sm:py-16">
						<h1 className="sao-title text-5xl font-bold uppercase tracking-[0.2em] text-white sm:text-6xl xl:text-7xl">
							Projects
						</h1>
						<div className="mx-auto mt-5 h-[3px] w-48 bg-gradient-to-r from-transparent via-[#EBA601] to-transparent" />
						<p className="mt-5 text-xl text-slate-300 xl:text-2xl">
							A quest log of the things I&apos;ve built.
						</p>
					</div>

					{/* 3. CAROUSEL */}
					<Carousel slides={slides} onBrowseAll={scrollToGrid} />

					{/* 4. CARDS */}
					<section
						id="browse"
						ref={gridRef}
						className="pt-24 [scroll-margin-top:-4rem]"
						aria-label="All projects"
					>
						<div className="mb-10 flex flex-col items-center gap-6">
							<h2 className="sao-title text-4xl font-bold uppercase tracking-[0.15em] text-white xl:text-5xl">
								All Projects
							</h2>

							{/* Filter buttons */}
							<div
								className="flex flex-wrap justify-center gap-3"
								role="group"
								aria-label="Filter projects"
							>
								{FILTERS.map((f) => {
									const on = filter === f.key;
									return (
										<button
											key={f.key}
											type="button"
											aria-pressed={on}
											onClick={() => changeFilter(f.key)}
											className={`sao-notch-s px-6 py-2.5 text-lg font-bold uppercase tracking-wider transition ${
												on
													? "bg-[#EBA601] text-[#1a1a1a]"
													: "bg-white/10 text-slate-200 hover:bg-white/20"
											}`}
										>
											{f.label}
										</button>
									);
								})}
							</div>
						</div>

						{/* key={shownFilter} makes React rebuild the grid on each filter change,
                which replays the fade-in animation on every card. */}
						<div
							key={shownFilter}
							className={`transition-opacity duration-200 ${leaving ? "opacity-0" : "opacity-100"}`}
						>
							{visible.length ? (
								<div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
									{visible.map((p, i) => (
										<div
											key={p.id}
											className="sao-fade-up flex"
											style={{ animationDelay: `${i * 90}ms` }} // each card starts a little later
										>
											<ProjectCard project={p} />
										</div>
									))}
								</div>
							) : (
								<p className="sao-fade-up py-16 text-center text-xl text-slate-400">
									No projects in this category yet.
								</p>
							)}
						</div>
					</section>
				</main>

				{/* 5. FOOTER */}
				<footer className="border-t border-white/10 px-6 pb-28 pt-8 text-center text-base text-slate-400 md:pb-8">
					<p>
						Interface graphics and fonts by{" "}
						<a
							href={ORIGINAL_AUTHOR.url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-[#EBA601] underline-offset-4 hover:underline"
						>
							{ORIGINAL_AUTHOR.name}
						</a>
						, shared by{" "}
						<a
							href={CREDIT.url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-[#EBA601] underline-offset-4 hover:underline"
						>
							{CREDIT.name}
						</a>{" "}
						on DeviantArt.
					</p>
					<p className="mt-1">
						Unofficial fan-made tribute. Sword Art Online belongs to its
						respective owners and this site is not affiliated with or endorsed
						by them.
					</p>
				</footer>
			</div>
		</div>
	);
}
