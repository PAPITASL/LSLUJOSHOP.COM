import type { StructuredDataValue } from "../structuredData";

export function StructuredData({ data }: { data: StructuredDataValue }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
