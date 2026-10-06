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
  if (!year) return true;
  const selectedYears = getProductYears(year);
  return getProductYears(value).some((candidate) => selectedYears.includes(candidate));
}

export function getCatalogYearRanges(products: readonly { anio: string }[]): string[] {
  return [...new Set(products.map((product) => product.anio.trim()).filter(Boolean))].sort(
    (a, b) => Number(b.match(/\d{4}/)?.[0] ?? 0) - Number(a.match(/\d{4}/)?.[0] ?? 0) || b.localeCompare(a),
  );
}

export function formatYearRange(value: string): string {
  const match = value.match(/^(\d{4})\s*[-–—]\s*(\d{4})$/);
  return match ? `Del ${match[1]} al ${match[2]}` : value;
}
