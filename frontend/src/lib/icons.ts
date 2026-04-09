export function iconForUrl(url: string) {
  const normalized = url.toLowerCase();
  if (normalized.includes("youtube")) return "▶";
  if (normalized.includes("github")) return "⌘";
  if (normalized.includes("instagram")) return "◎";
  if (normalized.includes("twitter") || normalized.includes("x.com")) return "𝕏";
  if (normalized.includes("linkedin")) return "in";
  return "↗";
}
