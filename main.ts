// Leonida Legend — entry for the gta6-trophy-guide-01 bounty (Node 22, stdlib only).
//
// The guide itself is app/: plain static files a browser opens at app/index.html
// (one ES module, one stylesheet, one JSON data file, no build step), fully offline:
// nothing it loads comes over the network, and its 55 trophies and their guides
// are app/data/trophies.json. This file hands it in: it copies app/ and
// screenshots/ from beside this file to /output and writes /output/dossier.json,
// the summary the judge reads (the screenshots, the first load's files and bytes,
// and the source), with the vendored make.fun library. Leave
// vendor/makefun-frontend.ts exactly as the kit ships it: the scorer requires
// dossier.json to be byte for byte what its own copy writes.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const appDir = join(repoRoot, "app");
const shotsDir = join(repoRoot, "screenshots");

// The scorer's own caps (from the kit's gate): only text_max_bytes shapes the
// dossier's bytes; the others refuse an entry the scorer would refuse — more
// than 4 screenshots or one over 256 KiB; more than 993 files and directories
// in app/ or 48 MiB of app files. app/ counts beside /output's own 1000-entry
// cap, its screenshots/ and dossier.json, so leave them room.
const DOSSIER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
};

function handIn() {
  mkdirSync(outputDir, { recursive: true });
  cpSync(appDir, join(outputDir, "app"), { recursive: true });
  mkdirSync(join(outputDir, "screenshots"), { recursive: true });
  if (existsSync(shotsDir)) {
    cpSync(shotsDir, join(outputDir, "screenshots"), { recursive: true });
  }
  const dossier = buildDossier(outputDir, DOSSIER_CAPS);
  writeFileSync(join(outputDir, "dossier.json"), dossier);
}

handIn();
