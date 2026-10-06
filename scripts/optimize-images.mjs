import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const sourcePublic = join(projectRoot, "public");
export const optimizedPublicDir = join(projectRoot, ".image-cache", "public");
const manifestPath = join(projectRoot, ".image-cache", "manifest.json");
const productSourceDir = join(sourcePublic, "catalogo-editado");
const productOutputDir = join(optimizedPublicDir, "catalogo-editado");
const CONFIG_VERSION = "webp-card-640-q84-large-original-q88-v1";
const RASTER_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function sha256(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function optimizedStem(publicRelative) {
  return publicRelative
    .replace(/\.(?:jpe?g)\.png$/i, "")
    .replace(/\.(?:png|jpe?g|webp)$/i, "");
}

function copyNonProductAssets() {
  mkdirSync(optimizedPublicDir, { recursive: true });
  for (const entry of readdirSync(sourcePublic, { withFileTypes: true })) {
    if (entry.name === "catalogo-editado") continue;
    cpSync(join(sourcePublic, entry.name), join(optimizedPublicDir, entry.name), {
      recursive: entry.isDirectory(),
      force: true,
    });
  }
}

async function validateVariant(filePath, expectedAlpha) {
  const metadata = await sharp(filePath).metadata();
  if (metadata.format !== "webp" || !metadata.width || !metadata.height) {
    throw new Error(`WebP inválido: ${filePath}`);
  }
  if (expectedAlpha && !metadata.hasAlpha) {
    throw new Error(`Se perdió la transparencia: ${filePath}`);
  }
  return metadata;
}

export async function optimizeProductImages() {
  copyNonProductAssets();
  mkdirSync(productOutputDir, { recursive: true });

  const previous = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
  const manifest = {};
  const files = walk(productSourceDir).filter((file) => RASTER_EXTENSIONS.has(extname(file).toLowerCase()));
  let converted = 0;
  let cached = 0;
  let sourceBytes = 0;
  let outputBytes = 0;
  let alphaImages = 0;

  for (const sourcePath of files) {
    const sourceRelative = relative(productSourceDir, sourcePath).replaceAll("\\", "/");
    const publicRelative = `catalogo-editado/${sourceRelative}`;
    const outputStem = optimizedStem(publicRelative);
    const cardRelative = `${outputStem}.card.webp`;
    const largeRelative = `${outputStem}.large.webp`;
    const cardPath = join(optimizedPublicDir, ...cardRelative.split("/"));
    const largePath = join(optimizedPublicDir, ...largeRelative.split("/"));
    const hash = sha256(sourcePath);
    const cacheKey = `${hash}:${CONFIG_VERSION}`;
    const sourceStat = statSync(sourcePath);
    sourceBytes += sourceStat.size;
    mkdirSync(resolve(cardPath, ".."), { recursive: true });
    if (previous[publicRelative]?.cacheKey === cacheKey) {
      for (const [oldRelative, newPath] of [
        [previous[publicRelative].card.path, cardPath],
        [previous[publicRelative].large.path, largePath],
      ]) {
        const oldPath = join(optimizedPublicDir, ...oldRelative.split("/"));
        if (oldPath !== newPath && existsSync(oldPath) && !existsSync(newPath)) cpSync(oldPath, newPath);
        if (oldPath !== newPath && existsSync(oldPath)) rmSync(oldPath);
      }
    }
    const outputsExist = existsSync(cardPath) && existsSync(largePath);
    const recoveredCurrentRun = !previous[publicRelative]
      && outputsExist
      && statSync(cardPath).mtimeMs >= statSync(sourcePath).mtimeMs
      && statSync(largePath).mtimeMs >= statSync(sourcePath).mtimeMs;
    const cacheHit = outputsExist
      && (previous[publicRelative]?.cacheKey === cacheKey || recoveredCurrentRun);
    let sourceInfo = previous[publicRelative]?.cacheKey === cacheKey
      ? previous[publicRelative].source
      : undefined;

    if (!sourceInfo) {
      const sourceMetadata = await sharp(sourcePath).metadata();
      const supportsAlpha = ["png", "webp"].includes(sourceMetadata.format ?? "") && Boolean(sourceMetadata.hasAlpha);
      const hasAlpha = supportsAlpha ? !(await sharp(sourcePath).stats()).isOpaque : false;
      sourceInfo = {
        width: sourceMetadata.width,
        height: sourceMetadata.height,
        bytes: sourceStat.size,
        hasAlpha,
      };
    }
    if (sourceInfo.hasAlpha) alphaImages += 1;

    if (!cacheHit) {
      await sharp(sourcePath)
        .rotate()
        .resize({ width: 640, withoutEnlargement: true })
        .webp({ quality: 84, alphaQuality: 100, effort: 5 })
        .toFile(cardPath);
      await sharp(sourcePath)
        .rotate()
        .webp({ quality: 88, alphaQuality: 100, effort: 5 })
        .toFile(largePath);
      converted += 1;
    } else {
      cached += 1;
    }

    const cardMetadata = await validateVariant(cardPath, sourceInfo.hasAlpha);
    const largeMetadata = await validateVariant(largePath, sourceInfo.hasAlpha);
    const cardBytes = statSync(cardPath).size;
    const largeBytes = statSync(largePath).size;
    outputBytes += cardBytes + largeBytes;
    manifest[publicRelative] = {
      cacheKey,
      source: sourceInfo,
      card: { path: cardRelative, width: cardMetadata.width, height: cardMetadata.height, bytes: cardBytes },
      large: { path: largeRelative, width: largeMetadata.width, height: largeMetadata.height, bytes: largeBytes },
    };
  }

  mkdirSync(resolve(manifestPath, ".."), { recursive: true });
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  return { files: files.length, converted, cached, alphaImages, sourceBytes, outputBytes };
}
