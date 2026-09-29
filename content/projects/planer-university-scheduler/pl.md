---
description: Planer pomaga studentom PWr ułożyć plan zajęć bez ręcznego żonglowania grupami w USOS.
type: Aplikacja webowa
role: Główny kontrybutor
period: 12/2024 – obecnie
stat: 50,5 tys. wyświetleń
---

## Cel projektu

Solvro Planer to intuicyjna aplikacja do planowania semestru. Student wybiera przedmioty i grupy, a Planer układa z nich czytelny tygodniowy plan. Zapisy nadal robi się w USOS, Planer służy do ich przygotowania.

- Mniej czasu na ręczne poprawianie planu
- Pełna kontrola nad własnym harmonogramem

## Moja część

Jestem głównym kontrybutorem projektu: ponad 130 commitów i 110 pull requestów. Repozytorium ma ponad 70 gwiazdek na GitHubie.

- Przepisana natywna integracja z USOS
- Serwer MCP, przez który agent AI zarządza planami
- REST API do planów
- Szybkie logowanie przez Email Verification Protocol z Chrome

## Analityka

Dane z publicznego dashboardu dla wersji 1.0:

<Stats data="50,5k|wyświetleń;13,2k|wizyt;7,17k|unikalnych osób;3m 58s|średni czas wizyty" />

## Uruchom lokalnie

```bash
git clone https://github.com/Solvro/web-planer.git
cd web-planer && npm install
# frontend/.env: SITE_URL, USOS_CONSUMER_KEY, USOS_CONSUMER_SECRET, USOS_BASE_URL
cd frontend && npm run dev
```

## Współtworzenie

Projekt jest open source. Zgłaszaj błędy, proponuj funkcje i testuj nowe wersje w repozytorium koła.
