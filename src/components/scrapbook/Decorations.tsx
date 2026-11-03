"use client";

import { useEffect, useRef } from "react";
import { annotate } from "rough-notation";
import rough from "roughjs";
import { Flower, Heart, Sparkle, Star, Plant } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import styles from "./scrapbook.module.css";

export function HandUnderline({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let active = true;
    let annotation: ReturnType<typeof annotate> | undefined;
    document.fonts.ready.then(() => {
      if (!active) return;
      annotation = annotate(element, { type: "underline", color: "#bf8870", strokeWidth: 1.5, padding: 3, animate: !reducedMotion, animationDuration: 650, iterations: 2 });
      annotation.show();
    });
    return () => { active = false; annotation?.remove(); };
  }, [reducedMotion]);
  return <span ref={ref} className={styles.underline}>{children}</span>;
}

export function SketchArrow() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const svg = ref.current;
    const drawing = rough.svg(svg);
    const options = { stroke: "#665440", strokeWidth: 1.2, roughness: 1, seed: 17 };
    svg.replaceChildren(drawing.path("M 8 72 Q 2 22 68 13 M 55 7 L 69 13 L 61 26", options));
    return () => svg.replaceChildren();
  }, []);
  return <svg ref={ref} viewBox="0 0 80 80" className={styles.sketchArrow} aria-hidden="true" />;
}

export function Tape({ sage = false, className = "" }: { sage?: boolean; className?: string }) {
  return <span aria-hidden="true" className={`${styles.tape} ${sage ? styles.sageTape : ""} pattern-diagonal-stripes-sm ${className}`} />;
}

export function ScatteredDecor() {
  return <div className={styles.scattered} aria-hidden="true">
    <Heart className={styles.heartOne} size={19} weight="fill" />
    <Star className={styles.starOne} size={28} weight="fill" />
    <Flower className={styles.flowerOne} size={30} weight="fill" />
    <Sparkle className={styles.sparkleOne} size={21} weight="regular" />
    <Heart className={styles.heartTwo} size={13} weight="fill" />
    <Star className={styles.starTwo} size={13} weight="fill" />
    <Flower className={styles.flowerTwo} size={24} weight="regular" />
  </div>;
}

export function Binding({ center = false }: { center?: boolean }) {
  return <div className={`${styles.binding} ${center ? styles.centerBinding : ""}`} aria-hidden="true">
    {Array.from({ length: 10 }, (_, index) => <span key={index} className={styles.ring} />)}
  </div>;
}

export function Botanical({ className = "" }: { className?: string }) {
  return <span className={`${styles.botanical} ${className}`} aria-hidden="true"><Plant size="100%" weight="thin" /></span>;
}
