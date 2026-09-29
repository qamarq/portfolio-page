# Portfolio Page

This repository contains a personal portfolio website built using Next.js, Tailwind CSS, TypeScript and Markdown content. The portfolio showcases projects, skills, and personal information in a professional format, making it easy to view and navigate.

## Features

- **Responsive Design**: Built with Tailwind CSS to ensure the website looks great on all devices.
- **Modern Frameworks**: Developed with Next.js for fast and SEO-friendly static site generation.
- **TypeScript Support**: Ensures type safety, improving code quality and maintainability.

## Getting Started

### Prerequisites

To run this project locally, you need:

- **Node.js** (v16 or higher recommended)
- **npm** or **yarn** for dependency management

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/qamarq/portfolio-page.git
   ```
2. **Navigate into the project directory**:
   ```bash
   cd portfolio-page
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```
4. **Setup .env\***:
   ```bash
   cp .env.example .env
   ```
   And fill `.env` with your own data & keys

### Running the Development Server

After installing the dependencies, start the local development server:

```bash
pnpm dev
```

This will run the application at http://localhost:3000. Open it in your browser to see the portfolio in action.

### Building for Production

To build a production-ready version of the site, run:

```bash
pnpm build & pnpm start
```

## Content

All content lives in Markdown files in `content/`. There is no CMS or database.

- `content/site/en.md`: shared settings (name, email, stats, stack, skills, experience, socials) and the bio in the body.
- `content/site/pl.md`: Polish overrides. Any field left out falls back to `en.md`.
- `content/projects/<slug>/en.md` and `pl.md`: one folder per project. The folder name is the URL slug.

Project frontmatter:

```yaml
title: Solvro Planer
description: One sentence shown on cards and in meta tags.
type: Web app
role: Top contributor
org: KN Solvro # optional
period: 12/2024 – now # optional
stat: 50.5k views # optional highlight on the card
featured: true # featured projects get a large card
order: 20 # lower numbers come first
cover: /projects/planer-university-scheduler.webp # file in public/
url: https://planer.solvro.pl # optional live site
repo: https://github.com/Solvro/web-planer # optional
tags: [Next.js, AdonisJS]
```

The body is regular Markdown. `<Stats data="50.5k|page views;13.2k|visits" />` renders a stats grid.

Frontmatter is validated with zod in `lib/content.ts`, so a typo fails the build with the file name in the error.

The GitHub heatmap needs `GITHUB_TOKEN` in `.env`. Without it the section is hidden.

## Contributing

Feel free to open issues or pull requests if you have suggestions or improvements.

---

Thank you for visiting this portfolio project. Enjoy exploring!
