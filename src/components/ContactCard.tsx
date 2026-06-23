"use client";

import { useState } from "react";

const MATRIX_HANDLE = "@qamarq:matrix.kamilmarczak.pl";
const DISCORD_HANDLE = "qamarq";

export function ContactCard() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  async function handleCopy(field: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  }

  return (
    <div className="card">
      <p className="card-label">contact</p>
      <div className="flex flex-col gap-3">
        <a
          href="https://github.com/qamarq"
          target="_blank"
          rel="noopener"
          className="group flex items-baseline gap-2"
        >
          <span className="font-mono text-xs text-(--text-muted)">github·</span>
          <span className="text-sm text-[var(--text-primary)] transition-colors group-hover:text-(--accent)">
            @qamarq
          </span>
        </a>

        <a
          href="mailto:me@kamilmarczak.pl"
          className="group flex items-baseline gap-2"
        >
          <span className="font-mono text-xs text-(--text-muted)">email·</span>
          <span className="text-sm text-[var(--text-primary)] transition-colors group-hover:text-(--accent)">
            me@kamilmarczak.pl
          </span>
        </a>

        <button
          type="button"
          onClick={() => handleCopy("matrix", MATRIX_HANDLE)}
          className="group flex items-baseline gap-2 text-left"
        >
          <span className="font-mono text-xs text-(--text-muted)">matrix·</span>
          <span className="text-sm text-[var(--text-primary)] transition-colors group-hover:text-(--accent)">
            {copiedField === "matrix" ? "copied!" : MATRIX_HANDLE}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleCopy("discord", DISCORD_HANDLE)}
          className="group flex items-baseline gap-2 text-left"
        >
          <span className="font-mono text-xs text-(--text-muted)">
            discord·
          </span>
          <span className="text-sm text-[var(--text-primary)] transition-colors group-hover:text-(--accent)">
            {copiedField === "discord" ? "copied!" : DISCORD_HANDLE}
          </span>
        </button>
      </div>
    </div>
  );
}
