---
title: Solvro Planer
description: Planer helps WUST students build their class schedule without juggling groups by hand in USOS.
type: Web app
role: Top contributor
org: KN Solvro
period: 12/2024 – now
stat: 50.5k views
featured: true
order: 20
cover: /projects/planer-university-scheduler.webp
url: https://planer.solvro.pl
repo: https://github.com/Solvro/web-planer
tags: [Next.js, AdonisJS, Better Auth, MCP, Coolify]
---

## Project goal

Solvro Planer is an intuitive app for planning a semester. Students pick courses and groups, and Planer turns them into a clear weekly schedule. Registration still happens in USOS; Planer is for preparing it.

- Less time spent on manual timetable fixes
- Full control over your own schedule

## My part

I am the top contributor to the project, with over 130 commits and 110 pull requests. The repository has more than 70 stars on GitHub.

- A rewrite of the native USOS integration
- An MCP server that lets an AI agent manage your plans
- A REST API for plans
- A fast sign-in path through Chrome’s Email Verification Protocol

## Analytics

Numbers from the public dashboard for version 1.0:

<Stats data="50.5k|page views;13.2k|visits;7.17k|unique visitors;3m 58s|avg. visit" />

## Run it locally

```bash
git clone https://github.com/Solvro/web-planer.git
cd web-planer && npm install
# frontend/.env: SITE_URL, USOS_CONSUMER_KEY, USOS_CONSUMER_SECRET, USOS_BASE_URL
cd frontend && npm run dev
```

## Contributing

The project is open source. Report bugs, suggest features and test new versions in the club’s repository.
