export function getProductYears(value: string): string[] {
  const years = new Set<string>();
  const ranges = /\b(\d{4})\s*[-–—]\s*(\d{4})\b/g;
  for (const match of value.matchAll(ranges)) {
    const start = Number(match[1]);
    const end = Number(match[2]);
    if (end < start) continue;
    for (let year = start; year <= end; year++) years.add(String(year));
  }
  for (const year of value.match(/\b\d{4}\b/g) ?? []) years.add(year);
  return [...years].sort((a, b) => Number(b) - Number(a));
}

export function getCatalogYears(products: readonly { anio: string }[]): string[] {
  return [...new Set(products.flatMap((product) => getProductYears(product.anio)))].sort(
    (a, b) => Number(b) - Number(a),
  );
}

export function matchesProductYear(value: string, year: string): boolean {
  return !year || getProductYears(value).includes(year);
}
