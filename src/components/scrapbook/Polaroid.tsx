"use client";

import Image from "next/image";
import { Camera, Heart } from "@phosphor-icons/react";
import { motion } from "motion/react";
import type { Photo } from "@/lib/types";
import { Tape } from "./Decorations";
import styles from "./scrapbook.module.css";

export function Polaroid({ photo, onClick, cover = false, index = 0 }: {
  photo?: Photo | null;
  onClick?: () => void;
  cover?: boolean;
  index?: number;
}) {
  const content = <>
    <Tape sage={index % 2 === 1} />
    <div className={`${styles.photoWindow} ${!photo ? styles.photoPlaceholder : ""}`}>
      {photo ? <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height}
        sizes={cover ? "(max-width: 600px) 55vw, 280px" : "(max-width: 700px) 70vw, 350px"}
        priority={cover} style={{ objectPosition: photo.focalPoint ?? "center" }} /> : <>
        <Camera size={30} weight="thin" />
        <span>a favorite photo<br />belongs here</span>
        <Heart size={15} weight="fill" />
      </>}
    </div>
    <span className={styles.photoCaption}>{photo ? photo.caption : (cover ? "you, & all the love around you" : "a little moment to keep")}</span>
    {cover && <Tape sage className={styles.bottomTape} />}
  </>;
  return photo && onClick ? <motion.button type="button" className={`${styles.polaroid} ${cover ? styles.coverPolaroid : ""}`}
    onClick={onClick} aria-label={`Enlarge photo: ${photo.caption || photo.alt}`} aria-haspopup="dialog"
    whileHover={{ y: -5, rotate: 0 }} whileTap={{ scale: 0.98 }}>{content}</motion.button>
    : <div className={`${styles.polaroid} ${cover ? styles.coverPolaroid : ""}`}>{content}</div>;
}
