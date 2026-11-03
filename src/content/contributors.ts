import type { Contributor } from "@/lib/types";
import { contributions } from "./contributions";

const people: [string, string, Contributor["group"], Contributor["layout"], Contributor["accent"]][] = [
  ["aryaman", "Aryaman", "friends", "portrait", "sage"],
  ["jia", "Jia", "friends", "pair", "coral"],
  ["kshitig", "Kshitig", "friends", "strip", "ochre"],
  ["paarth", "Paarth", "friends", "letter", "sage"],
  ["bawa", "Bawa", "friends", "pair", "coral"],
  ["keishaa", "Keishaa", "friends", "portrait", "ochre"],
  ["kaavya", "Kaavya", "friends", "strip", "coral"],
  ["navya", "Navya", "friends", "pair", "sage"],
  ["manavi", "Manavi", "friends", "letter", "ochre"],
  ["dipika", "Dipika", "friends", "portrait", "coral"],
  ["london", "London", "friends", "pair", "sage"],
  ["amina", "Amina", "friends", "strip", "ochre"],
  ["medha", "Medha", "friends", "letter", "sage"],
  ["shaira", "Shaira", "friends", "portrait", "coral"],
  ["shanaya", "Shanaya", "friends", "pair", "ochre"],
  ["samaira", "Samaira", "friends", "strip", "sage"],
  ["khushi", "Khushi", "friends", "portrait", "coral"],
  ["ranveer", "Ranveer", "friends", "letter", "ochre"],
  ["sahil", "Sahil", "friends", "pair", "sage"],
  ["sanaa", "Sanaa", "friends", "portrait", "coral"],
  ["veer", "Veer", "friends", "pair", "sage"],
  ["aaji", "Aaji", "family", "portrait", "ochre"],
  ["mama", "Mama", "family", "pair", "sage"],
  ["arjun", "Arjun", "family", "strip", "coral"],
  ["aai", "Aai", "family", "letter", "sage"],
  ["baba", "Baba", "family", "portrait", "ochre"],
];

export const contributors: Contributor[] = people.map(([id, name, group, layout, accent], order) => ({
  id, name, group, layout, accent, order,
  message: contributions[id]?.message ?? [],
  photos: contributions[id]?.photos ?? [],
}));
