import type { Contributor, Photo } from "./types";

export function validateContent(
  people: Contributor[],
  settings: { name: string; status: "draft" | "ready"; coverPhoto: Photo | null },
): string[] {
  const errors: string[] = [];
  if (!settings.name.trim()) errors.push("Set the birthday display name.");
  const ids = new Set<string>();
  for (const person of people) {
    if (ids.has(person.id)) errors.push(`Duplicate contributor ID: ${person.id}`);
    ids.add(person.id);
    if (settings.status === "ready" && !person.message.some((p) => p.trim())) {
      errors.push(`${person.name}: add the actual message before marking the book ready.`);
    }
    for (const photo of person.photos) validatePhoto(photo, person.name, errors);
  }
  if (settings.coverPhoto) validatePhoto(settings.coverPhoto, "Cover", errors);
  if (settings.status === "ready" && !settings.coverPhoto) errors.push("Add the real cover photograph.");
  return errors;
}

function validatePhoto(photo: Photo, owner: string, errors: string[]) {
  if (!photo.src.startsWith("/photos/") || photo.src.includes("..")) errors.push(`${owner}: use a local /photos/ path.`);
  if (!photo.alt.trim()) errors.push(`${owner}: describe the photograph in alt text.`);
  if (!(photo.width > 0 && photo.height > 0)) errors.push(`${owner}: set positive photo dimensions.`);
}
