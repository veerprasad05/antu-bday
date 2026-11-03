import { BirthdayBook } from "@/components/book/BirthdayBook";
import { birthday } from "@/content/birthday";
import { contributors } from "@/content/contributors";
import { validateContent } from "@/lib/content-validation";

export default function Home() {
  const errors = validateContent(contributors, birthday);
  if (errors.length) throw new Error(errors.join("\n"));
  return <BirthdayBook />;
}
