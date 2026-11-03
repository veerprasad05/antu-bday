import type { Metadata } from "next";
import "@fontsource/caveat/400.css";
import "@fontsource/caveat/600.css";
import "@fontsource/caveat/700.css";
import "@fontsource/lora/400.css";
import "@fontsource/lora/400-italic.css";
import "pattern.css/dist/pattern.min.css";
import "./globals.css";
import { birthday } from "@/content/birthday";

export const metadata: Metadata = {
  title: `A little book of ${birthday.name}`,
  description: "A birthday scrapbook, filled with little pieces of love from your people.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
