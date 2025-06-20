import {
  createOgImage,
  defaultSize,
  defaultContentType,
} from "./og-image-util";

export const alt = "TheArenaX";
export const size = defaultSize;
export const contentType = defaultContentType;

function getTitleFromParams(params?: Record<string, string>) {
  if (!params) return "TheArenaX";
  if (params.about !== undefined) return "About TheArenaX";
  if (params.contact !== undefined) return "Contact TheArenaX";
  if (params.slug) return `Page: ${params.slug}`;
  if (params.tag && params.item)
    return `Tag: ${params.tag}, Item: ${params.item}`;
  if (params.tag) return `Tag: ${params.tag}`;
  return "TheArenaX";
}

function getThemeFromParams(params?: Record<string, string>) {
  if (params?.tag) return "dark";
  return "light";
}

export default function Image({ params }: { params?: Record<string, string> }) {
  const text = getTitleFromParams(params);
  const theme = getThemeFromParams(params);
  return createOgImage({
    text,
    size,
    theme,
  });
}
