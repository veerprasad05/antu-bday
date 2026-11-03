import type { Photo } from "@/lib/types";

export const birthday: {
  name: string;
  dateLabel: string;
  dedication: string;
  status: "draft" | "ready";
  coverPhoto: Photo | null;
  closingLetter: { from: string; paragraphs: string[] } | null;
} = {
  name: "Antara",
  dateLabel: "a day all about you",
  dedication: "made with so much love",
  status: "draft",
  coverPhoto: {
    src: "/photos/cover.jpeg",
    width: 1024,
    height: 683,
    alt: "Young Antara sitting inside a blue play tent",
    caption: "",
    focalPoint: "60% 50%",
  },
  closingLetter: null,
};
