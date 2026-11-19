import * as fs from "node:fs";
import * as path from "node:path";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

function copyDir(src: string, dst: string): void {
  const entries = fs.readdirSync(src, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  for (const entry of entries) {
    const from = path.join(src, entry.name);
    const to = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(to, { recursive: true });
      copyDir(from, to);
    } else if (entry.isFile()) {
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(from, to);
    }
  }
}

function main(): void {
  const repoRoot = path.resolve(import.meta.dirname);
  fs.mkdirSync(outDir, { recursive: true });
  copyDir(path.join(repoRoot, "app"), path.join(outDir, "app"));
  copyDir(path.join(repoRoot, "screenshots"), path.join(outDir, "screenshots"));
  const dossier = buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
    app_path_max_bytes: 1000,
  });
  fs.writeFileSync(path.join(outDir, "dossier.json"), dossier);
}

main();
