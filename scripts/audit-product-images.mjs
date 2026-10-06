import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import sharp from "sharp";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const publicDir = join(projectRoot, "public");
const distDir = join(projectRoot, "dist");
const cacheDir = join(projectRoot, ".image-cache", "public");
const reportPath = join(projectRoot, ".image-cache", "product-image-audit.json");
const fallbackReportPath = join(projectRoot, ".image-cache", "fallback-products.csv");

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function fileForUrl(root, url) {
  if (!url?.startsWith("/") || url.startsWith("//")) return undefined;
  return join(root, ...decodeURI(url).slice(1).split("/"));
}

function historicalOriginalCandidates(url) {
  if (!url || url.startsWith("http")) return [];
  const candidates = [url];
  if (/\.jpe?g\.png$/i.test(url)) candidates.push(url.replace(/\.jpe?g\.png$/i, ".png"));
  return [...new Set(candidates)];
}

function sourceJsonProducts() {
  return walk(join(projectRoot, "src", "data"))
    .filter((path) => /^catalogo.*\.json$/i.test(relative(join(projectRoot, "src", "data"), path)))
    .flatMap((path) => JSON.parse(readFileSync(path, "utf8")).map((product) => ({
      ...product,
      jsonFile: relative(projectRoot, path).replaceAll("\\", "/"),
    })));
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

async function validImage(path) {
  if (!path || !existsSync(path)) return false;
  try {
    const metadata = await sharp(path).metadata();
    return Boolean(metadata.width && metadata.height);
  } catch {
    return false;
  }
}

export async function auditProductImages({ writeReport = true } = {}) {
  const vite = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  try {
    const { PRODUCTS } = await vite.ssrLoadModule("/src/data/products.ts");
    const { getProductImageVariantUrl } = await vite.ssrLoadModule("/src/app/productImage.ts");
    const rawById = new Map(sourceJsonProducts().map((product) => [product.id, product]));
    const rows = [];

    for (const product of PRODUCTS) {
      const raw = rawById.get(product.id);
      const candidates = historicalOriginalCandidates(product.img);
      const validOriginalUrl = candidates.find((url) => existsSync(fileForUrl(publicDir, url)));
      const originalPath = validOriginalUrl ? fileForUrl(publicDir, validOriginalUrl) : undefined;
      const beforeValid = Boolean(validOriginalUrl) && await validImage(originalPath);
      const cardUrl = beforeValid ? getProductImageVariantUrl(product.img, "card") : "/log.png";
      const largeUrl = beforeValid ? getProductImageVariantUrl(product.img, "large") : "/log.png";
      const cardPath = fileForUrl(cacheDir, cardUrl);
      const largePath = fileForUrl(cacheDir, largeUrl);
      const cardExists = beforeValid ? await validImage(cardPath) : true;
      const largeExists = beforeValid ? await validImage(largePath) : true;
      const distCardExists = beforeValid ? existsSync(fileForUrl(distDir, cardUrl)) : true;
      const distLargeExists = beforeValid ? existsSync(fileForUrl(distDir, largeUrl)) : true;
      const incorrectlyForcedFallback = beforeValid && !product.hasImage;
      let group = "G";
      let reason = "Otra inconsistencia";

      if (beforeValid && cardExists && largeExists && !incorrectlyForcedFallback) {
        group = "A";
        reason = "Fotografía original y ambas variantes válidas";
      } else if (incorrectlyForcedFallback) {
        group = "B";
        reason = "hasImage=false aunque el original histórico existe";
      } else if (beforeValid && (!cardExists || !largeExists)) {
        group = "C";
        reason = "Falta una variante WebP";
      } else if (!beforeValid) {
        group = "E";
        reason = "No existe una fotografía original válida";
      }

      const metadata = originalPath && beforeValid ? await sharp(originalPath).metadata() : {};
      rows.push({
        id: product.id,
        nombre: product.nombre,
        marca: product.marca,
        modelo: product.modelo,
        jsonFile: raw?.jsonFile,
        imgJson: raw?.img,
        resolvedOriginal: product.img,
        validOriginalUrl,
        originalExists: beforeValid,
        originalWidth: metadata.width,
        originalHeight: metadata.height,
        originalBytes: originalPath && existsSync(originalPath) ? statSync(originalPath).size : 0,
        hasImageFlag: product.hasImage,
        cardUrl,
        cardExists,
        distCardExists,
        largeUrl,
        largeExists,
        distLargeExists,
        usesFallbackCurrently: !beforeValid,
        group,
        reason,
      });
    }

    const summary = {
      products: rows.length,
      beforeValid: rows.filter((row) => row.originalExists).length,
      legitimateFallback: rows.filter((row) => row.group === "E").length,
      groups: Object.fromEntries("ABCDEFG".split("").map((group) => [group, rows.filter((row) => row.group === group).length])),
      missingCard: rows.filter((row) => row.originalExists && !row.cardExists).length,
      missingLarge: rows.filter((row) => row.originalExists && !row.largeExists).length,
      missingDistCard: rows.filter((row) => row.originalExists && !row.distCardExists).length,
      missingDistLarge: rows.filter((row) => row.originalExists && !row.distLargeExists).length,
    };
    const report = { generatedAt: new Date().toISOString(), summary, rows };
    if (writeReport) {
      mkdirSync(resolve(reportPath, ".."), { recursive: true });
      writeFileSync(reportPath, JSON.stringify(report, null, 2));
      const fallbackRows = rows.filter((row) => row.group === "E");
      const csv = [
        ["ID", "NOMBRE", "MARCA", "MODELO", "IMG JSON", "MOTIVO DEL FALLBACK"],
        ...fallbackRows.map((row) => [row.id, row.nombre, row.marca, row.modelo, row.imgJson, row.reason]),
      ].map((columns) => columns.map(csvCell).join(",")).join("\n");
      writeFileSync(fallbackReportPath, `${csv}\n`);
    }
    return report;
  } finally {
    await vite.close();
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = await auditProductImages();
  console.log(JSON.stringify(report.summary, null, 2));
  const errors = report.rows.filter((row) => ["B", "C", "D", "F", "G"].includes(row.group));
  if (errors.length) {
    console.log(`\nProductos con inconsistencias: ${errors.length}`);
    for (const row of errors) console.log(`${row.id} | ${row.marca} ${row.modelo} | ${row.nombre} | ${row.group} | ${row.reason}`);
  }
}
