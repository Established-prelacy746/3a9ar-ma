import Image from "next/image";
import type { ComponentProps } from "react";

export function PropertyImage({ src, ...props }: ComponentProps<typeof Image>) {
  const isAvito =
    typeof src === "string" &&
    (src.startsWith("https://content.avito.ma") || src.startsWith("http://content.avito.ma"));
  const isMubawab =
    typeof src === "string" &&
    (src.startsWith("https://www.mubawab-media.com") || src.startsWith("http://www.mubawab-media.com"));

  return <Image src={src} unoptimized={isAvito || isMubawab || undefined} {...props} />;
}
