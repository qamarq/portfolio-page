---
description: Strona dr. Adama Marczaka z Wydziału Matematyki PWr, z planem zajęć, konsultacjami, stronami grup dla studentów, własnym CMS-em i asystentem AI.
type: Strona, CMS i asystent AI
period: 03/2025 – obecnie
stat: 2 agenty AI
---

## O projekcie

Strona prowadzącego z Wydziału Matematyki Politechniki Wrocławskiej. Studenci sprawdzają na niej plan zajęć, konsultacje, materiały dydaktyczne i ogłoszenia. Całość to monorepo w pnpm z czterema aplikacjami: publiczną stroną, panelem administracyjnym i dwoma agentami AI. Napisałem 216 z 218 commitów.

![Tygodniowy plan zajęć](/projects/adam-marczak-plan.webp)

## Dla studentów

- Tygodniowy plan zajęć z budynkiem i salą na każdym kafelku; kolumny dopasowują się do nakładających się zajęć, a puste dni są ukryte
- Konsultacje w bieżącym semestrze i w sesji
- Strony grup z materiałami, w których część sekcji i plików widzą tylko zalogowani członkowie grupy
- Logowanie studentów przez Better Auth
- Asystent AI na stronie głównej, który odpowiada na pytania o plan, konsultacje, materiały i ogłoszenia i pobiera dane narzędziami zamiast zgadywać
- Statyczny eksport Next.js pod `/~amarczak`, z breadcrumbami w JSON-LD dla wyszukiwarek

## Panel administracyjny

- Edycja każdej części strony: ogłoszeń, konsultacji, kontaktu, dydaktyki, linków, planu zajęć i zakładki O mnie
- Grupy i konta studentów, strony kursów z bloków przeciąganych myszą, z wcięciami, i kopiowanie kursów
- Pliki na S3 udostępniane przez podpisane linki
- Logowanie passkeyem i zarządzanie sesjami
- Publikacja jednym kliknięciem: panel uruchamia wdrożenie w GitHub Actions i pokazuje każdy krok
- Asystent AI dla administratora z historią wątków i pamięcią, który edytuje stronę przez 36 narzędzi i pyta o zgodę przed każdym usunięciem

## Agenty AI

Oba agenty działają na eve, frameworku Vercela do trwałych agentów AI, z modelami OpenAI przez AI SDK. Agent studencki ma 11 narzędzi tylko do odczytu, a zakres tego, co widzi, wynika z zalogowanego konta, a nie z tego, co ktoś napisze w rozmowie.

## Wdrożenie

Serwer wydziału jest za uczelnianym VPN-em, więc workflow w GitHub Actions łączy się z GlobalProtect przez openconnect i wysyła zbudowaną stronę po SFTP, razem z plikiem `.htaccess` do czystych adresów.

## Stack

- pnpm workspaces: frontend, backend, agent-student i agent-admin
- Next.js jako statyczny eksport strony i pełna aplikacja panelu, z tRPC i TanStack Query
- Better Auth z passkeys, Drizzle i PostgreSQL
- S3, AI SDK i eve
