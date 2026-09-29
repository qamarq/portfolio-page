---
title: RozliczKorki
description: A free, open-source app for tutors on the web, iOS and Android that tracks lessons, payments and earnings.
type: Web & mobile app
role: Creator · solo developer
period: 2026
stat: iOS · Android · web
featured: true
order: 10
cover: /projects/rozliczkorki.webp
url: https://rozliczkorki.pl
repo: https://github.com/qamarq/rozliczkorki.pl
tags: [Next.js, Expo, tRPC, Better Auth, Drizzle]
---

## About

RozliczKorki replaces the tutor’s paper notebook. After a lesson you tap “done” and “paid”, and at the end of the month you know how much you earned and who still owes you. Every feature is free and sign-up does not ask for a card.

- Web app at [rozliczkorki.pl](https://rozliczkorki.pl)
- iOS app on the [App Store](https://apps.apple.com/pl/app/rozliczkorki-pl/id6812730431)
- Android app on [Google Play](https://play.google.com/store/apps/details?id=pl.rozliczkorki.app)

## Key features

- Recurring lessons with done and paid status, cash or transfer
- Partial payments carried over to the next lessons
- Rate history, language-school payouts and holidays
- Stats: effective hourly rate, collection rate and a forecast
- Push reminders 15 minutes before a lesson
- iOS widgets and Live Activities
- A calendar feed you can subscribe to
- Sign-in with Google, Apple or a passkey

## Tech stack

- Turborepo monorepo shared by the web and mobile apps
- Next.js 16 on the web, Expo and React Native on phones
- tRPC API, Better Auth, Drizzle and PostgreSQL on Neon
- CI that ships Google Play internal releases and iOS TestFlight builds
