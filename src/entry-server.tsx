import { BASE_PATH, withBasePath } from "./app/basePath";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { AppRoutes } from "./app/App";
import { getCanonicalUrl } from "./app/seo";
import { getSeoRoutes } from "./app/seoRoutes";

export { getSeoRoutes } from "./app/seoRoutes";

export function renderSeoRoute(path: string) {
  const route = getSeoRoutes().find((candidate) => candidate.path === path);
  if (!route) throw new Error(`No existe una ruta SEO para ${path}`);

  return {
    html: renderToString(
      <StaticRouter basename={BASE_PATH} location={withBasePath(path)}>
        <AppRoutes />
      </StaticRouter>,
    ),
    canonical: getCanonicalUrl(route.seo.path),
  };
}
