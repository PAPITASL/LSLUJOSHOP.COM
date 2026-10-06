import { spawn } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { optimizeProductImages } from "./optimize-images.mjs";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const viteCli = join(projectRoot, "node_modules", "vite", "bin", "vite.js");
const stats = await optimizeProductImages();

console.log(
  `Imágenes preparadas: ${stats.files} (${stats.converted} convertidas, ${stats.cached} desde caché)`,
);

const vite = spawn(process.execPath, [viteCli, ...process.argv.slice(2)], {
  cwd: projectRoot,
  env: process.env,
  stdio: "inherit",
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => vite.kill(signal));
}

vite.on("exit", (code) => process.exit(code ?? 0));
