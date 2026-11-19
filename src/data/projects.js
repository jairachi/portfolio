// ============================================================================
//  PROJECTS DATA  —  this is the ONLY file you need to edit to add projects.
// ============================================================================
//
//  Each project is one object in the array below. Copy a block, paste it
//  at the end, and change the values.
//
//  Fields
//  ------
//  id          unique short name, no spaces (used internally as a React key)
//  title       project name
//  tagline     one short line shown in the carousel
//  description full text shown on the project card (use \n for a new line)
//  image       path to a screenshot/cover. Put images in  public/projects/
//              and write them like  "projects/my-game.png"
//              (leave "" to show a placeholder instead)
//  imageFit    OPTIONAL. "cover" (default) fills the frame and crops the edges.
//              "contain" shows the WHOLE image with dark bars on the sides —
//              best for tall phone-app screenshots.
//  imagePosition OPTIONAL. With "cover", which part of the image stays visible
//              when it is cropped: "center" (default), "top", "bottom",
//              "left", "right", or e.g. "50% 20%".
//  status      "completed" | "in-progress"
//  tags        list of short labels, e.g. ["React", "Unity", "C#"]
//  featured    true = also appears in the top carousel
//  links       one or more buttons. Each is { label, url, type }
//              type is "github" | "itch" | "pages" | "other"
//              (the type only changes which icon-less label colour is used,
//               the url can be anything)
//
//  The first link in the list is the card's main "Open" button.
// ============================================================================

export const PROJECTS = [
	{
		id: "odyssey",
		title: "Andy's Arcade: Odyssey",
		tagline: "Collect artifacts scattered across space and save the universe.",
		description:
			"A game made in collaboration with my friends and classmates for a school event. A space adventure RPG that lets you travel through space and collect artifacts, in order to save the universe.",
		image: "projects/odyssey.png", // e.g. "projects/sample-game.png"
		status: "completed",
		tags: ["RPG Maker MV", "JavaScript"],
		featured: true,
		links: [
			{
				label: "Play on Itch.io",
				url: "https://yummypecho.itch.io/odyssey",
				type: "itch",
			},
		],
	},
	{
		id: "slice-of-life",
		title: "Slice of Life",
		tagline: "Make every slice of life count.",
		description:
			"A gamified task-and-habit app that aims to help students and young adults who want to build better habits, especially those who loves RPGs and anime, and would be more motivated if real-world wins counted as progress in a game.",
		image: "projects/slice-of-life.jpg",
		imagePosition: "50% 25%",
		status: "completed",
		tags: ["Flutter"],
		featured: true,
		links: [
			{
				label: "View Repository",
				url: "https://github.com/jairachi/slice-of-life",
				type: "github",
			},
			{
				label: "Try It Out",
				url: "https://jairachi.github.io/slice-of-life/",
				type: "pages",
			},
		],
	},
	{
		id: "portfolio",
		title: "My Portfolio Website",
		tagline: "You are currently here.",
		description: "My website containing the projects I've done over the years.",
		image: "projects/portfolio.PNG",
		status: "in-progress",
		tags: ["React", "Tailwind"],
		featured: true,
		links: [
			{ label: "Open Site", url: "https://pages.github.com/", type: "pages" },
		],
	},
];

// ----------------------------------------------------------------------------
//  Credit line shown at the bottom of the page.
//  NOTE: the CREDITS.md inside the assets zip names "darkblackswords"
//  (pack: "Sword Art Online - Vector Graphics | All in one"). You told me the
//  graphics came from GPBeta, so I used that. Please double-check the source
//  and change the two values below if needed.
// ----------------------------------------------------------------------------
export const ORIGINAL_AUTHOR = {
	name: "darkblackswords",
	url: "https://www.deviantart.com/darkblackswords",
};

export const CREDIT = {
	name: "GPBeta",
	url: "https://www.deviantart.com/gpbeta",
};

// Style info for the status tags (green = completed, orange = in progress).
export const STATUS = {
	completed: { label: "Completed", color: "#4ade80" },
	"in-progress": { label: "In Progress", color: "#EBA601" },
};

// Button colours per link type.
export const LINK_STYLE = {
	github: { bg: "#3278BE", text: "#FBFBFB" },
	itch: { bg: "#EBA601", text: "#1a1a1a" },
	pages: { bg: "#0CA8E0", text: "#0b1220" },
	other: { bg: "#4D4D4D", text: "#FBFBFB" },
};
