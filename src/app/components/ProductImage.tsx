import { withBasePath } from "../basePath";
import type { ImgHTMLAttributes } from "react";
import { getProductImageVariantUrl, useProductImageFallback } from "../productImage";

interface ProductImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "loading" | "decoding"> {
  src: string;
  variant: "card" | "large";
  critical?: boolean;
}

export function ProductImage({ src, variant, critical = false, ...props }: ProductImageProps) {
  const optimizedSrc = getProductImageVariantUrl(src, variant);

  return (
    <img
      {...props}
      src={optimizedSrc}
      loading={critical ? "eager" : "lazy"}
      decoding={critical ? "sync" : "async"}
      {...(critical ? { fetchpriority: "high" } : {})}
      onError={(event) => {
        if (event.currentTarget.getAttribute("src") === optimizedSrc && optimizedSrc !== src) {
          event.currentTarget.src = withBasePath(src || "/log.png");
          return;
        }
        useProductImageFallback(event);
      }}
    />
  );
}
