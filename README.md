# Portfolio

A personal portfolio website with a professional layout, a Sword Art Online-inspired interface, and hints of gamification.

**[View the live site](https://jairachi.github.io/portfolio/)**

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=reactrouter&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-222?logo=github)

## Table of Contents

- [Features](#features)
- [Pages](#pages)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Adding Projects](#adding-projects)
- [Deployment](#deployment)
- [Credits](#credits)

## Features

- SAO-style interface with a fixed background and an always-visible spinning ring
- Smooth-scrolling anchor links and a side quick-navigation menu that tucks away until hovered
- Fade transitions when switching projects
- Self-advancing carousel of featured projects
- Filterable project cards with fade in/out
- Responsive layout for large desktop displays and smaller laptops
- Project data kept in one file, shared by every page

## Pages

| Page | Status |
| --- | --- |
| Home | Active |
| Projects | Active |

_Pages are built one at a time. This table is updated each time a page is finished._

**Home**: hero (name, pitch, role), a projects preview of up to three projects with a "See more" button, and a contact section.

**Projects**: a featured-project carousel and an "All Projects" card list with filter buttons. Each project links to its GitHub repo, Itch.io page, or GitHub Pages site. The side menu has **Featured** and **Browse**.

## Tech Stack

- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/) (`react-router-dom`)
- [GitHub Pages](https://pages.github.com/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/jairachi/portfolio.git

# Go into the project folder
cd portfolio

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open the local address printed in the terminal.

## Project Structure

```
portfolio/
├── public/
├── src/
│   ├── assets/        # SAO graphics and fonts
│   ├── data/          # Projects data file
│   ├── Home.jsx       # Home page
│   └── ...            # Projects page and other components
├── package.json
└── README.md
```

## Adding Projects

Projects live in the data file inside `src/data`. Add or edit an entry there and both the Home and Projects pages update automatically.

## Deployment

The site is hosted on GitHub Pages. Because it uses `BrowserRouter`, the router's `basename` and the build's base path must be set to `/portfolio`.

## Credits

Graphics and fonts by darkblackswords, shared by [GPBeta on DeviantArt](https://www.deviantart.com/gpbeta).
