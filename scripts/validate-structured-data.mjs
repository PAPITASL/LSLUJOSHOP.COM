import { readFileSync } from "node:fs";
import { join } from "node:path";

function outputFileForRoute(distDir, path) {
  if (path === "/") return join(distDir, "index.html");
  return join(distDir, ...path.split("/").filter(Boolean), "index.html");
}

function hasNullishValue(value) {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value)) return value.some(hasNullishValue);
  if (typeof value === "object") return Object.values(value).some(hasNullishValue);
  return false;
}

export function validateStructuredData(distDir, routes) {
  const errors = [];
  let breadcrumbPages = 0;
  let jsonLdScripts = 0;

  for (const route of routes) {
    const html = readFileSync(outputFileForRoute(distDir, route.path), "utf8");
    const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    const expectsBreadcrumb = ["brand", "model", "product"].includes(route.kind);
    jsonLdScripts += scripts.length;

    if (expectsBreadcrumb && scripts.length !== 1) {
      errors.push(`${route.path}: esperaba 1 JSON-LD y encontró ${scripts.length}`);
      continue;
    }
    if (!expectsBreadcrumb && scripts.length !== 0) {
      errors.push(`${route.path}: JSON-LD no esperado`);
      continue;
    }
    if (!expectsBreadcrumb) continue;

    let schema;
    try {
      schema = JSON.parse(scripts[0][1]);
    } catch {
      errors.push(`${route.path}: JSON inválido`);
      continue;
    }

    if (schema["@context"] !== "https://schema.org" || schema["@type"] !== "BreadcrumbList") {
      errors.push(`${route.path}: tipo o contexto incorrecto`);
      continue;
    }
    if (!Array.isArray(schema.itemListElement) || schema.itemListElement.length === 0) {
      errors.push(`${route.path}: breadcrumb vacío`);
      continue;
    }
    if (hasNullishValue(schema)) errors.push(`${route.path}: contiene null o undefined`);

    schema.itemListElement.forEach((item, index) => {
      if (item["@type"] !== "ListItem") errors.push(`${route.path}: ListItem inválido`);
      if (item.position !== index + 1) errors.push(`${route.path}: posición no consecutiva`);
      if (typeof item.name !== "string" || !item.name.trim()) errors.push(`${route.path}: nombre vacío`);
      if (item.item && !/^https?:\/\//.test(item.item)) errors.push(`${route.path}: item no absoluto`);
    });
    breadcrumbPages += 1;
  }

  if (errors.length) throw new Error(`Validación JSON-LD fallida:\n${errors.slice(0, 25).join("\n")}`);
  return { routes: routes.length, breadcrumbPages, jsonLdScripts, errors: 0 };
}
