import fs from "node:fs";
import path from "node:path";

function getCvLastUpdated(): string | null {
  try {
    const { birthtime, mtime } = fs.statSync(
      path.join(process.cwd(), "public/cv.pdf"),
    );
    // birthtime is unreliable (epoch 0) on some filesystems — fall back to mtime.
    const date = birthtime.getTime() > 0 ? birthtime : mtime;
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

export function CVCard() {
  const lastUpdated = getCvLastUpdated();

  return (
    <div className="card">
      <p className="card-label">resume</p>
      <div className="mb-4">
        <p className="text-sm font-medium text-[var(--text-primary)]">
          Kamil Marczak
        </p>
        <p className="mt-0.5 text-xs text-(--text-muted)">
          Fullstack Developer
        </p>
        {lastUpdated && (
          <p className="mt-3 font-mono text-xs text-(--text-muted)">
            last updated: {lastUpdated}
          </p>
        )}
      </div>
      <a
        href="/cv.pdf"
        download="Kamil_Marczak_CV.pdf"
        className="cv-download-btn"
      >
        ↓ download pdf
      </a>
    </div>
  );
}
