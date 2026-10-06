import { withBasePath } from "./basePath";
import type { SyntheticEvent } from "react";

const IMAGE_FOLDERS: Array<[prefix: string, folder: string]> = [
  ["CHEVROLET_SILVERADO_2000_", "chevrolet-silverado-2000"],
  ["CHEVROLET_SILVERADO_2003_", "chevrolet-silverado-03"],
  ["CHEVROLET_SILVERADO_1990-1999_", "chevrolet-silverado-1990-1999"],
  ["CHEVROLET_SILVERADO_2004_", "chevrolet-silverado-2004"],
  ["FORD_F150_2012_", "ford-f150-2012"],
  ["FORD_BRONCO_90_", "ford-bronco-1990"],
  ["FORD_150_2020_", "ford-150-2020"],
  ["FORD_LOBO_1999_", "ford-lobo-1999"],
];

const EXACT_IMAGE_PATHS: Record<string, string> = {
  "/catalogo-editado/volkswagen-golf-jetta-mk5-a5-2005-2010/VOLKSWAGEN_GOLF_JETTA_MK5_A5_2005_2010_DIRECCIONALES_LATERALES_LED_DE_BUMPER_AHUMADAS.jpg":
    "/catalogo-editado/volkswagen-golf-jetta-mk5-a5-2005-2010/VOLKSWAGEN_GOLF_GTI_JETTA_MK5_A5_2005_2010_DIRECCIONALES_LATERALES_LED_DE_BUMPER_AHUMADAS.jpg.png",
  "CHEVROLET_SILVERADO_1990-1999_INSERTOS_PARRILLA_BILLET.jpg":
    "/catalogo-editado/chevrolet-silverado-1990-1999/CHEVROLET_SILVERADO_1990-1999_INSERTOS_PARRILA_BILLET.jpg.png",
  "CHEVROLET_SILVERADO_1990-1999_KIT_FAROLAS_PROTECTOR_HALO_Y_LUCES_TRASERAS.jpg":
    "/catalogo-editado/chevrolet-silverado-1990-1999/CHEVROLET_SILVERADO_1990-1999_KIT_FAROLAS__PROTECTOR_HALO_Y_LUCES__TRASERAS.jpg.png",
  "CHEVROLET_SILVERADO_1990-1999_KIT_FAROLAS_Y_LUCES_TRASERAS_AHUMADAS.jpg":
    "/catalogo-editado/chevrolet-silverado-1990-1999/CHEVROLET_SILVERADO_1990-1999_KIT_FAROLAS__Y_LUCES__TRASERAS_AHUMADAS.jpg.png",
  "CHEVROLET_SILVERADO_1990-1999_KIT_LUCES_TRASERAS_LED_AHUMADAS_TERCER_STOP.jpg":
    "/catalogo-editado/chevrolet-silverado-1990-1999/CHEVROLET_SILVERADO_1990-1999_KIT_LUCES_TRASERAS_LED_AHUMADAS__TERCER_STOP.jpg.png",
  "CHEVROLET_SILVERADO_1990-1999_CARATULA_TABLERO_INDIGLO_NEGRA_AZUL.jpg":
    "/catalogo-editado/chevrolet-silverado-1990-1999/CHEVROLET_SILVERADO_1990-1999_CARATULA_TABLERO__INDIGLO_NEGRA_AZUL.jpg.png",
  "FORD_LOBO_1999_PARRILLA_BILLET_ALUMINIO_PULIDO.jpg":
    "/catalogo-editado/ford-lobo-1999/FORD_LOBO_1999_PARRILLA_BILLET_ALUMINIO_PULIDOjpg.png",
  "FORD_LOBO_1999_STOPS_TRASEROS_FLARESIDE.jpg":
    "/catalogo-editado/ford-lobo-1999/FORD_LOBO_1999_STOPS_TRASEROS__FLARESIDE.png",
  "FORD_LOBO_1999_FAROLAS_DELANTERAS_PROYECTOR_LED_FONDO_NEGRO.jpg":
    "/catalogo-editado/ford-lobo-1999/FORD_LOBO_1999_FAROLAS_DELANTERAS_PROYECTOR__LED__FONDO_NEGRO.jpg.png",
  "FORD_LOBO_1999_FAROS_DELANTEROS_PROYECTOR_CROMADOS.jpg":
    "/catalogo-editado/ford-lobo-1999/FORD_LOBO_1999_FAROLAS_DELANTERAS_PROYECTOR__CROMADAS.jpg.png",
  "FORD_LOBO_1999_KIT_TABLERO_ELECTROLUMINISCENTE_AZUL_VARIANTE1.jpg":
    "/catalogo-editado/ford-lobo-1999/FORD_LOBO_1999_KIT_TABLERO_ELECTROLUMINISCENTE_AZUL_VARIANTE.jpg.png",
};

const VW_GOLF_MK4_SOURCE = "/catalogo-editado/volkswagen-golf-mk4/";
const VW_GOLF_MK4_FOLDER = "/catalogo-editado/VOLKSWAGEN_MK4_GOLF_99_2006 YA/";

const VW_GOLF_MK4_FILENAMES: Record<string, string> = {
  "VOLKSWAGEN_MK4_GOLF_99_2006_KIT_MANIJAS_INTERIORES_Y_BISEL_ELEVAVIDRIOS.png":
    "VOLKSWAGEN_GOLF_MK4_1999_2006_KIT_DE_MANIJAS_INTERIORES_Y_BISEL_ELEVAVIDRIOS.png",
  "VOLKSWAGEN_MK4_GOLF_99_2006_INTERRUPTOR_MAESTRO_ELEVAVIDRIOS.png":
    "VOLKSWAGEN_GOLF_MK4_1999_2006_INTERRUPTOR_ELEVAVIDRIOS.png",
};

const MISSING_SILVERADO_90_99_IDS = new Set([
  406, 407, 408, 425, 426, 427, 428, 429, 431, 442, 443, 444, 445, 446,
  458, 459, 460, 461, 462, 466, 467, 468, 469, 470, 482, 483, 484, 485, 486,
]);
const MISSING_LOBO_1999_IDS = new Set([
  92, 96, 105, 110, 111, 112, 113, 114, 115, 116, 130, 133, 135, 141,
]);

export const hasCatalogImage = (catalogPath: string, productId: number) => {
  if (catalogPath.includes("catalogo_VW_golfmk4_99_06")) return true;
  if (catalogPath.includes("catalogo_ford_f150_17")) return false;
  if (catalogPath.includes("catalogo_ford_bronco_90")) return productId !== 179;
  if (catalogPath.includes("catalogo_ford_lobo_1999")) return !MISSING_LOBO_1999_IDS.has(productId);
  if (catalogPath.includes("catalogo_chevrolet_silverado_90-99")) return !MISSING_SILVERADO_90_99_IDS.has(productId);
  return true;
};

export const resolveProductImage = (img?: string) => {
  if (!img) return "/log.png";
  if (img.startsWith("http")) return img;

  if (img.startsWith(VW_GOLF_MK4_SOURCE)) {
    const filename = img.slice(VW_GOLF_MK4_SOURCE.length);
    return encodeURI(`${VW_GOLF_MK4_FOLDER}${VW_GOLF_MK4_FILENAMES[filename] ?? filename}`);
  }

  if (EXACT_IMAGE_PATHS[img]) return encodeURI(EXACT_IMAGE_PATHS[img]);

  if (img.startsWith("/")) return img;

  if (img.startsWith("FORD_BRONCO_FULL_SIZE_") || img.startsWith("FORD_BRONCO_INTERRUPTOR_")) {
    const filename = img
      .toLowerCase()
      .replace(".jpg", "")
      .replace("proyector", "projector")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return `/catalogo-editado/ford-bronco-full-size-1980-1996/${filename}-png.webp`;
  }

  const match = IMAGE_FOLDERS.find(([prefix]) => img.startsWith(prefix));
  if (match) {
    // Several exported assets retain their original .jpg suffix and add .png.
    return encodeURI(`/catalogo-editado/${match[1]}/${img}.png`);
  }

  return encodeURI(`/VOLKSWAGEN_MK4_GOLF_99_2006 YA/${img}`);
};

export const getProductImageVariantUrl = (source: string, variant: "card" | "large") => {
  if (!source || source.startsWith("http") || !decodeURI(source).startsWith("/catalogo-editado/")) {
    return withBasePath(source || "/log.png");
  }
  const stem = source
    .replace(/\.(?:jpe?g)\.png$/i, "")
    .replace(/\.(?:png|jpe?g|webp)$/i, "");
  return withBasePath(`${stem}.${variant}.webp`);
};

export const useProductImageFallback = (event: SyntheticEvent<HTMLImageElement>) => {
  const image = event.currentTarget;
  const source = image.getAttribute("src") ?? "";

  if (/\.(?:card|large)\.webp$/i.test(source)) {
    image.onerror = null;
    image.src = withBasePath("/log.png");
    return;
  }

  if (/\.jpe?g\.png$/i.test(source)) {
    image.src = source.replace(/\.jpe?g\.png$/i, ".png");
    return;
  }

  image.onerror = null;
  image.src = withBasePath("/log.png");
};
