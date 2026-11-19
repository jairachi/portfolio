import { useEffect, useState } from "react";

// Assets live in public/sao/. BASE_URL keeps paths correct on GitHub Pages.
const A = `${import.meta.env.BASE_URL}sao/`;
const icon = (name, on) => `${A}icons/${name}${on ? "_on" : ""}.svg`;

// ---- Content: edit these, not the markup ----
const PLAYER = {
	name: "Michal Jireh L. de la Cruz",
	short: "Michal",
	role: "Software and Game Developer",
	pitch: "I treat every project like a level worth finishing.",
};

const NAV = [
	{ id: "profile", icon: "man", label: "Profile" },
	{ id: "quests", icon: "items", label: "Projects" },
	{ id: "skills", icon: "skills", label: "Skills" },
	{ id: "contact", icon: "message", label: "Contact" },
];

// image: path to a picture, or null for the blue grid placeholder
const QUESTS = [
	{
		title: "Project One",
		note: "One or two sentences on what it does and the result.",
		tag: "Completed",
		image: null,
		href: "#",
	},
	{
		title: "Project Two",
		note: "One or two sentences on what it does and the result.",
		tag: "Completed",
		image: null,
		href: "#",
	},
	{
		title: "Project Three",
		note: "Currently building this one.",
		tag: "In progress",
		image: null,
		href: "#",
	},
];

const SKILLS = [
	{ label: "React", value: 85, icon: "one-handed-straight-sword" },
	{ label: "Tailwind CSS", value: 90, icon: "dual-blades" },
	{ label: "JavaScript", value: 80, icon: "searching" },
	{ label: "UI Design", value: 70, icon: "parrying" },
];

const GRID = {
	backgroundColor: "#2563EB",
	backgroundImage:
		"linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)",
	backgroundSize: "24px 24px",
};

const FOCUS =
	"focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A300]";
const HEADING = "font-['SAOWelcome',system-ui,sans-serif] font-bold";

// Fonts and the one slow ring animation (skipped if the visitor prefers reduced motion)
const CSS = `
@font-face{font-family:"SAOUI";src:url(${A}fonts/saouitt-regular.ttf) format("truetype");font-weight:400;font-display:swap}
@font-face{font-family:"SAOUI";src:url(${A}fonts/saouitt-bold.ttf) format("truetype");font-weight:700;font-display:swap}
@font-face{font-family:"SAOWelcome";src:url(${A}fonts/saowelcomett-bold.ttf) format("truetype");font-weight:700;font-display:swap}
@keyframes sao-spin{to{transform:rotate(360deg)}}
@keyframes sao-fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:no-preference){.sao-spin{animation:sao-spin 90s linear infinite}html{scroll-behavior:smooth}.sao-fade{animation:sao-fade .35s ease-out}}
`;

// Round icon with an orange "_on" version that fades in when active or when the parent .group is hovered
function Icon({ name, on, className = "h-14 w-14" }) {
	return (
		<span className={`relative inline-block shrink-0 ${className}`}>
			<img src={icon(name)} alt="" className="absolute inset-0 h-full w-full" />
			<img
				src={icon(name, true)}
				alt=""
				className={`absolute inset-0 h-full w-full transition-opacity ${on ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"}`}
			/>
		</span>
	);
}

// White SAO-style window
function Panel({ title, children, className = "" }) {
	return (
		<div
			className={`overflow-hidden rounded-sm bg-[#F4F6FA] text-[#3C4350] shadow-[0_8px_30px_rgba(0,0,0,.35)] ${className}`}
		>
			{title && (
				<div className="border-b border-[#D5DAE3] bg-white px-6 py-3 text-center text-xl font-bold">
					{title}
				</div>
			)}
			{children}
		</div>
	);
}

export default function Home() {
	const [xp, setXp] = useState(0);
	const [active, setActive] = useState("profile");
	const [sel, setSel] = useState(0);

	// Scroll progress becomes XP
	useEffect(() => {
		const onScroll = () => {
			const max = document.documentElement.scrollHeight - window.innerHeight;
			setXp(
				max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0,
			);
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	// Highlight the menu icon of the section on screen
	useEffect(() => {
		const io = new IntersectionObserver(
			(entries) =>
				entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
			{ rootMargin: "-40% 0px -55% 0px" },
		);
		NAV.forEach((n) => {
			const el = document.getElementById(n.id);
			if (el) io.observe(el);
		});
		return () => io.disconnect();
	}, []);

	const level = 1 + Math.floor(xp / 25);
	const q = QUESTS[sel];

	return (
		<div className="relative isolate min-h-screen w-full bg-[#070F24] text-left text-xl font-bold text-white font-['SAOUI',system-ui,sans-serif]">
			<style>{CSS}</style>

			{/* Fixed backdrop: stays in place while the content scrolls over it */}
			<div
				aria-hidden="true"
				className="pointer-events-none fixed inset-0 -z-10"
				style={{
					background:
						"radial-gradient(ellipse at center, #17306B 0%, #0A1633 60%, #070F24 100%)",
				}}
			>
				<div className="absolute left-1/2 top-1/2 w-[min(760px,90vh)] -translate-x-1/2 -translate-y-1/2 opacity-40">
					<img
						src={`${A}ui/tech-circle.svg`}
						alt=""
						className="sao-spin w-full"
					/>
				</div>
			</div>

			{/* Player HUD */}
			<header className="sticky top-0 z-20 bg-[#070F24]/80 backdrop-blur">
				<div className="mx-auto flex max-w-[1500px] items-center justify-center gap-3 px-5 py-4 md:px-28">
					<span className="text-2xl font-bold">{PLAYER.short}</span>
					<span className="w-14 text-lg font-bold text-[#F5A300]">
						LV {level}
					</span>
					<div
						className="h-5 max-w-xl flex-1 border border-white/50 bg-[#1B2438]"
						style={{
							clipPath: "polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
						}}
						role="progressbar"
						aria-label="Page progress"
						aria-valuenow={xp}
						aria-valuemin={0}
						aria-valuemax={100}
					>
						<div
							className="h-full bg-gradient-to-b from-[#B6E24A] to-[#5FA81E] transition-[width] duration-150 motion-reduce:transition-none"
							style={{ width: `${xp}%` }}
						/>
					</div>
					<span className="w-20 text-base">{xp} XP</span>
				</div>
			</header>

			{/* Circle menu: left column on desktop, bottom bar on phones */}
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

			<main className="mx-auto max-w-[1500px] px-5 pb-28 md:pb-16 md:px-28">
				{/* Hero: centered over a slowly turning ring */}
				<section
					id="profile"
					className="relative flex scroll-mt-20 flex-col items-center overflow-hidden py-28 text-center sm:py-40"
				>
					<p className="relative mb-4 text-lg font-bold text-[#F5A300]">
						Player profile: {PLAYER.role}
					</p>
					<h1
						className={`relative max-w-3xl text-6xl leading-[1.05] sm:text-8xl ${HEADING}`}
					>
						{PLAYER.name}
					</h1>
					<p className="relative mt-8 max-w-2xl text-2xl leading-relaxed text-[#DCE5FA]">
						{PLAYER.pitch}
					</p>
					<div className="relative mt-10 flex flex-wrap justify-center gap-4">
						<a
							href="#quests"
							className={`rounded-full bg-[#F5A300] px-8 py-4 text-xl font-bold text-[#2B2F38] hover:bg-[#FFC14D] ${FOCUS}`}
						>
							View my projects
						</a>
						<a
							href="#contact"
							className={`rounded-full border-2 border-white px-8 py-4 text-xl font-bold hover:bg-white hover:text-[#2B2F38] ${FOCUS}`}
						>
							Get in touch
						</a>
					</div>
				</section>

				{/* Projects: list on the left, details on the right */}
				<section id="quests" className="scroll-mt-20 py-16">
					<Panel title="Quests">
						<div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
							<ul className="divide-y divide-[#D5DAE3] border-b border-[#D5DAE3] md:border-b-0 md:border-r">
								{QUESTS.map((item, i) => (
									<li key={item.title}>
										<button
											onClick={() => setSel(i)}
											aria-current={sel === i}
											className={`group flex w-full items-center gap-4 px-6 py-5 text-left text-2xl font-bold ${FOCUS} ${sel === i ? "bg-[#F5A300] text-[#2B2F38]" : "bg-white hover:bg-[#EAEEF5]"}`}
										>
											<Icon
												name="quest-message-box"
												on={sel === i}
												className="h-12 w-12"
											/>
											{item.title}
										</button>
									</li>
								))}
							</ul>
							<div key={sel} className="sao-fade p-8">
								<div
									className="relative h-60 bg-cover bg-center"
									style={
										q.image ? { backgroundImage: `url(${q.image})` } : GRID
									}
								>
									<span
										className={`absolute left-3 top-3 rounded-sm px-4 py-1.5 text-lg font-bold ${q.tag === "Completed" ? "bg-[#8BD22B] text-[#1B2B08]" : "bg-[#F5A300] text-[#2B2F38]"}`}
									>
										{q.tag}
									</span>
								</div>
								<h3 className="mt-6 text-3xl font-bold">{q.title}</h3>
								<p className="mt-3 text-xl leading-relaxed">{q.note}</p>
								<a
									href={q.href}
									className={`mt-6 inline-block rounded-full bg-[#F5A300] px-8 py-3 text-xl font-bold text-[#2B2F38] hover:bg-[#FFC14D] ${FOCUS}`}
								>
									Learn More
								</a>
							</div>
						</div>
					</Panel>
				</section>

				{/* Skills */}
				<section id="skills" className="scroll-mt-20 py-16">
					<Panel title="Skills">
						<ul className="grid gap-8 p-8 sm:grid-cols-2">
							{SKILLS.map((s) => (
								<li key={s.label} className="group flex items-center gap-3">
									<Icon name={s.icon} className="h-16 w-16" />
									<div className="flex-1">
										<div className="mb-2 flex justify-between text-xl font-bold">
											<span>{s.label}</span>
											<span>{s.value}/100</span>
										</div>
										<div
											className="h-4 bg-[#D5DAE3]"
											style={{
												clipPath:
													"polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)",
											}}
										>
											<div
												className="h-full bg-[#F5A300]"
												style={{ width: `${s.value}%` }}
											/>
										</div>
									</div>
								</li>
							))}
						</ul>
					</Panel>
				</section>

				{/* Contact: centered */}
				<section id="contact" className="scroll-mt-20 py-16">
					<Panel title="Message" className="mx-auto max-w-2xl">
						<div className="flex flex-col items-center p-12 text-center">
							<Icon name="message" on className="h-20 w-20" />
							<h2 className="mt-6 text-4xl font-bold">Ready to team up?</h2>
							<p className="mt-3 text-xl">
								Tell me about your project and I will reply within a few days.
							</p>
							<a
								href="mailto:you@example.com"
								className={`mt-6 rounded-full bg-[#F5A300] px-8 py-4 text-xl font-bold text-[#2B2F38] hover:bg-[#FFC14D] ${FOCUS}`}
							>
								Send an email
							</a>
						</div>
					</Panel>
				</section>
			</main>

			<footer className="px-5 pb-28 pt-6 text-center text-base leading-relaxed text-[#C9D3EA] md:pb-10 md:px-28">
				<p>
					Interface graphics and fonts by{" "}
					<a
						className="underline"
						href="https://www.deviantart.com/darkblackswords"
					>
						darkblackswords
					</a>
					, shared by{" "}
					<a className="underline" href="https://www.deviantart.com/gpbeta">
						GPBeta
					</a>{" "}
					on DeviantArt.
				</p>
				<p className="mt-1">
					Fan-made, unofficial. Sword Art Online belongs to its respective
					owners and is not affiliated with this site.
				</p>
				<p className="mt-1">
					&copy; {new Date().getFullYear()} {PLAYER.name}
				</p>
			</footer>
		</div>
	);
}
