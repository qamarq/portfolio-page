---
description: Darmowa aplikacja open source dla korepetytorów na web, iOS i Androida. Pilnuje planu lekcji, płatności i zarobków.
type: Aplikacja web i mobile
role: Twórca · solo developer
---

## O projekcie

RozliczKorki zastępuje zeszyt korepetytora. Po zajęciach klikasz „odbyło się” i „zapłacone”, a na koniec miesiąca wiesz, ile wpadło i kto jeszcze nie zapłacił. Wszystkie funkcje są darmowe, a przy rejestracji nie podajesz karty.

- Aplikacja webowa na [rozliczkorki.pl](https://rozliczkorki.pl)
- Aplikacja na iOS w [App Store](https://apps.apple.com/pl/app/rozliczkorki-pl/id6812730431)
- Aplikacja na Androida w [Google Play](https://play.google.com/store/apps/details?id=pl.rozliczkorki.app)

## Kluczowe funkcje

- Cykliczne lekcje ze statusem „odbyło się” i „zapłacone”, gotówką albo przelewem
- Częściowe płatności przenoszone na kolejne lekcje
- Historia stawek, rozliczenia ze szkołami językowymi i urlopy
- Statystyki: efektywna stawka godzinowa, ściągalność i prognoza
- Powiadomienia push 15 minut przed lekcją
- Widżety i Live Activities na iOS
- Kalendarz do zasubskrybowania
- Logowanie przez Google, Apple albo passkey

## Stack

- Monorepo w Turborepo wspólne dla weba i aplikacji mobilnych
- Next.js 16 na webie, Expo i React Native na telefonach
- API w tRPC, Better Auth, Drizzle i PostgreSQL na Neonie
- CI, które wypuszcza wewnętrzne wydania w Google Play i buildy iOS do TestFlight
