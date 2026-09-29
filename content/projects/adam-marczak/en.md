---
title: Adam Marczak
description: The site of Dr Adam Marczak from the WUST Faculty of Mathematics, with the class schedule, office hours, group pages for students, a custom CMS and an AI assistant.
type: Website, CMS & AI assistant
role: Full-stack developer
period: 03/2025 – now
stat: 2 AI agents
order: 80
cover: /projects/adam-marczak.webp
url: https://prac.im.pwr.edu.pl/~amarczak/
tags: [Next.js, tRPC, Better Auth, Drizzle, eve, AI SDK]
---

## About

A lecturer’s website at the Faculty of Mathematics of Wrocław University of Science and Technology. Students use it for the class schedule, office hours, teaching materials and announcements. It is a pnpm monorepo with four apps: the public site, an admin panel and two AI agents. I wrote 216 of its 218 commits.

![Weekly class schedule](/projects/adam-marczak-plan.webp)

## For students

- A weekly schedule with the building and room on every class; columns size themselves to overlapping classes and empty days are hidden
- Office hours for the current term and the exam session
- Group pages with materials, where some sections and files are visible only to signed-in members of the group
- Student sign-in with Better Auth
- An AI assistant on the home page that answers questions about the schedule, office hours, materials and announcements, reading the data through tools instead of guessing
- A static Next.js export served under `/~amarczak`, with breadcrumb JSON-LD for search engines

## Admin panel

- Editing for every part of the site: announcements, office hours, contact, teaching, links, schedule and the About page
- Student groups and accounts, course pages built from blocks that you reorder by drag and drop with indentation, and course copying
- Files on S3 served through signed links
- Passkey sign-in and session management
- One-click publishing: the panel starts the GitHub Actions deploy and shows each step of the run
- An admin AI assistant with thread history and memory that edits the site through 36 tools and asks for confirmation before deleting anything

## AI agents

Both agents run on eve, Vercel’s framework for durable AI agents, with OpenAI models through the AI SDK. The student agent has 11 read-only tools, and what it can see comes from the signed-in account, not from what someone claims in the chat.

## Deployment

The faculty server sits behind the university VPN, so the GitHub Actions workflow connects to GlobalProtect with openconnect and uploads the built site over SFTP, together with an `.htaccess` that handles clean URLs.

## Tech stack

- pnpm workspaces: frontend, backend, agent-student and agent-admin
- Next.js as a static export for the site and as a full app for the panel, with tRPC and TanStack Query
- Better Auth with passkeys, Drizzle and PostgreSQL
- S3 storage, AI SDK and eve
