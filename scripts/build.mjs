import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { performance } from "node:perf_hooks";
import { optimizeProductImages } from "./optimize-images.mjs";
import { validateStructuredData } from "./validate-structured-data.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(projectRoot, "dist");
const serverDir = join(projectRoot, ".prerender");
const viteCli = join(projectRoot, "node_modules", "vite", "bin", "vite.js");

function runVite(args, label) {
  const startedAt = performance.now();
  const result = spawnSync(process.execPath, [viteCli, ...args], {
    cwd: projectRoot,
    env: process.env,
    stdio: "inherit",
  });
  if (result.status !== 0) throw new Error(`${label} falló con código ${result.status ?? "desconocido"}`);
  return performance.now() - startedAt;
}

function escapeAttribute(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeText(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function replaceHead(html, route, canonical) {
  let output = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeText(route.seo.title)}</title>`)
    .replace(
      /<meta\s+name=["']description["'][^>]*>/i,
      `<meta name="description" content="${escapeAttribute(route.seo.description)}" />`,
    )
    .replace(
      /<meta\s+name=["']robots["'][^>]*>/i,
      `<meta name="robots" content="${escapeAttribute(route.seo.robots ?? "noindex, nofollow")}" />`,
    );

  if (canonical) {
    output = output.replace(
      /<\/head>/i,
      `  <link rel="canonical" data-lujoshop-seo="true" href="${escapeAttribute(canonical)}" />\n    </head>`,
    );
  }
  return output;
}

function outputFileForRoute(path) {
  if (path === "/") return join(distDir, "index.html");
  const segments = path.split("/").filter(Boolean);
  return join(distDir, ...segments, "index.html");
}

function validateRouteDefinition(route) {
  if (!route.path.startsWith("/") || route.path.includes(":") || route.path.includes("?")) {
    throw new Error(`Ruta SEO inválida: ${route.path}`);
  }
  if (!route.seo.title?.trim() || !route.seo.description?.trim()) {
    throw new Error(`Metadata incompleta: ${route.path}`);
  }
  if (route.kind === "model" && (!route.brand || !route.model)) {
    throw new Error(`Relación marca/modelo inválida: ${route.path}`);
  }
  if (route.kind === "product" && (!route.productId || !route.brand || !route.model)) {
    throw new Error(`Relación de producto inválida: ${route.path}`);
  }
}

function validateHtml(route, filePath, html) {
  const checks = [
    [existsSync(filePath), "archivo"],
    [html.trim().length > 0, "HTML no vacío"],
    [/<title>[^<]+<\/title>/i.test(html), "title"],
    [/<meta\s+name=["']description["']\s+content=["'][^"']+["']/i.test(html), "description"],
    [/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex[^"']*["']/i.test(html), "noindex"],
    [/<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>/i.test(html), "H1"],
  ];
  const failed = checks.filter(([passed]) => !passed).map(([, label]) => label);
  if (failed.length) throw new Error(`${route.path}: validación fallida (${failed.join(", ")})`);
}

const totalStartedAt = performance.now();
const imageStartedAt = performance.now();
const imageStats = await optimizeProductImages();
const imageMs = performance.now() - imageStartedAt;
let clientBuildMs;
let serverBuildMs;

try {
  clientBuildMs = runVite(["build"], "Build del cliente");
  serverBuildMs = runVite(
    ["build", "--ssr", "src/entry-server.tsx", "--outDir", ".prerender", "--emptyOutDir"],
    "Build de prerender",
  );

  const serverEntry = join(serverDir, "entry-server.js");
  const { getSeoRoutes, renderSeoRoute } = await import(pathToFileURL(serverEntry).href);
  const routes = getSeoRoutes();
  const uniquePaths = new Set(routes.map((route) => route.path));
  if (uniquePaths.size !== routes.length) throw new Error("El inventario SEO contiene rutas duplicadas");

  const template = readFileSync(join(distDir, "index.html"), "utf8");
  if (!template.includes('<div id="root"></div>')) throw new Error("No se encontró el contenedor raíz de React");

  const renderStartedAt = performance.now();
  const stats = { main: 0, brand: 0, model: 0, product: 0, bytes: 0 };

  for (const route of routes) {
    validateRouteDefinition(route);
    const rendered = renderSeoRoute(route.path);
    const html = replaceHead(template, route, rendered.canonical).replace(
      '<div id="root"></div>',
      `<div id="root">${rendered.html}</div>`,
    );
    const filePath = outputFileForRoute(route.path);
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, html, "utf8");
    validateHtml(route, filePath, html);
    stats[route.kind] += 1;
    stats.bytes += statSync(filePath).size;
  }

  // Unknown and legacy URLs can still load the router on GitHub Pages.
  writeFileSync(join(distDir, "404.html"), template, "utf8");
  writeFileSync(join(distDir, ".nojekyll"), "", "utf8");

  const renderMs = performance.now() - renderStartedAt;
  const structuredDataStats = validateStructuredData(distDir, routes);
  const totalMs = performance.now() - totalStartedAt;
  console.log("\nPrerender SEO validado correctamente");
  console.log(`  Rutas: ${routes.length} (${stats.main} principales, ${stats.brand} marcas, ${stats.model} modelos, ${stats.product} productos)`);
  console.log(`  HTML total: ${(stats.bytes / 1024 / 1024).toFixed(2)} MiB`);
  console.log(`  JSON-LD: ${structuredDataStats.breadcrumbPages} BreadcrumbList, ${structuredDataStats.errors} errores`);
  console.log(`  Imágenes: ${imageStats.files} (${imageStats.converted} convertidas, ${imageStats.cached} desde caché)`);
  console.log(`  Imágenes fuente: ${(imageStats.sourceBytes / 1024 / 1024).toFixed(2)} MiB`);
  console.log(`  Variantes WebP: ${(imageStats.outputBytes / 1024 / 1024).toFixed(2)} MiB`);
  console.log(`  Preparación de imágenes: ${(imageMs / 1000).toFixed(2)} s`);
  console.log(`  Build cliente: ${(clientBuildMs / 1000).toFixed(2)} s`);
  console.log(`  Build servidor: ${(serverBuildMs / 1000).toFixed(2)} s`);
  console.log(`  Render y validación: ${(renderMs / 1000).toFixed(2)} s`);
  console.log(`  Tiempo total: ${(totalMs / 1000).toFixed(2)} s`);
} finally {
  if (existsSync(serverDir)) rmSync(serverDir, { recursive: true, force: true });
}
