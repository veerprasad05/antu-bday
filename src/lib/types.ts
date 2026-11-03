export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  focalPoint?: string;
};

export type Contribution = {
  message: string[];
  photos: Photo[];
};

export type Contributor = Contribution & {
  id: string;
  name: string;
  group: "friends" | "family";
  order: number;
  layout: "portrait" | "pair" | "strip" | "letter";
  accent: "coral" | "sage" | "ochre";
};
