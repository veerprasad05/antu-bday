import { existsSync } from "node:fs";
import { join } from "node:path";
import { birthday } from "../src/content/birthday";
import { contributors } from "../src/content/contributors";
import { contributions } from "../src/content/contributions";
import { validateContent } from "../src/lib/content-validation";

const errors = validateContent(contributors, birthday);
for (const id of Object.keys(contributions)) {
  if (!contributors.some((person) => person.id === id)) errors.push(`Unknown contributor ID: ${id}`);
}
for (const photo of [...contributors.flatMap((p) => p.photos), ...(birthday.coverPhoto ? [birthday.coverPhoto] : [])]) {
  if (!existsSync(join(process.cwd(), "public", photo.src))) errors.push(`Missing photograph: ${photo.src}`);
}
if (process.argv.includes("--ready") && birthday.status !== "ready") errors.push("The book is still in draft mode.");
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Content valid (${birthday.status}); ${contributors.filter((p) => p.message.length).length}/${contributors.length} letters supplied.`);
