"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Heart, X } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import type { Contributor, Photo } from "@/lib/types";
import { birthday } from "@/content/birthday";
import { HandUnderline } from "../scrapbook/Decorations";
import { Polaroid } from "../scrapbook/Polaroid";
import styles from "./readers.module.css";

export function Envelope({ person, onRead }: { person: Contributor; onRead: (id: string) => void }) {
  const [unfolding, setUnfolding] = useState(false);
  const [flapOpened, setFlapOpened] = useState(false);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function openLetter(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (unfolding) return;
    setUnfolding(true);
    timer.current = setTimeout(() => {
      setOpen(true);
      if (person.message.length) onRead(person.id);
    }, reducedMotion ? 0 : 750);
  }

  return <Dialog.Root open={open} onOpenChange={(next) => { setOpen(next); if (!next) { setUnfolding(false); setFlapOpened(false); } }}>
    <Dialog.Trigger asChild>
      <button className={`${styles.envelope} ${styles[person.accent]}`} onClick={openLetter} aria-label={`Open ${person.name}'s letter`}>
        <motion.span className={styles.letterPeek} animate={{ y: flapOpened ? -55 : 0 }} transition={{ duration: reducedMotion ? 0 : .35 }} aria-hidden="true">Dear {birthday.name},<br /><span>just a little note for you…</span></motion.span>
        <span className={styles.envelopePocket} aria-hidden="true" />
        <motion.span className={`${styles.envelopeFlap} ${flapOpened ? styles.flapOpened : ""}`} animate={{ rotateX: unfolding ? 180 : 0 }} transition={{ duration: reducedMotion ? 0 : .35 }} onAnimationComplete={() => { if (unfolding) setFlapOpened(true); }} aria-hidden="true" />
        <span className={styles.seal} aria-hidden="true"><Heart size={21} weight="regular" /></span>
        <span className={styles.envelopeName}>for you, from {person.name}</span>
      </button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content className={styles.letterDialog} aria-describedby="letter-description">
        <Dialog.Close className={styles.close} aria-label="Close letter"><X size={22} /></Dialog.Close>
        <p className={styles.eyebrow}>A LITTLE PIECE OF LOVE</p>
        <Dialog.Title className={styles.title}>A letter from <HandUnderline>{person.name}</HandUnderline></Dialog.Title>
        <Dialog.Description id="letter-description" className={styles.description}>For {birthday.name}, with love.</Dialog.Description>
        <div className={styles.letterBody}>
          {person.message.length ? person.message.map((paragraph, index) => <p key={index}>{paragraph}</p>) : <div className={styles.pending}>
            <Heart size={26} weight="thin" />
            <p>This letter is waiting<br />to be tucked in.</p>
            <span>Draft placeholder · {person.name}&apos;s message hasn&apos;t been added yet.</span>
          </div>}
        </div>
        <span className={styles.signoff}>{person.message.length ? `with love, ${person.name}` : "a little space, saved for something lovely"}</span>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}

export function PhotoGallery({ photos, layout, compact = false }: { photos: Photo[]; layout: Contributor["layout"]; compact?: boolean }) {
  const [selected, setSelected] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const photo = selected !== null ? photos[selected] : null;
  const columns = photos.length === 1 ? 1 : photos.length === 2 ? 2 : 3;
  const galleryStyle = compact ? { "--gallery-columns": columns, "--gallery-rows": Math.ceil(photos.length / columns) } as CSSProperties : undefined;
  return <>
    <div className={`${styles.gallery} ${styles[layout]} ${compact ? styles.compactGallery : ""}`} style={galleryStyle}>
      {photos.map((item, index) => <Polaroid key={`${item.src}-${index}`} photo={item} index={index} onClick={() => {
        triggerRef.current = document.activeElement as HTMLElement;
        setSelected(index);
      }} />)}
    </div>
    <Dialog.Root open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.photoDialog} onCloseAutoFocus={(event) => { event.preventDefault(); triggerRef.current?.focus(); }}>
          <Dialog.Close className={styles.close} aria-label="Close photo"><X size={22} /></Dialog.Close>
          <Dialog.Title className="sr-only">Photograph {selected !== null ? selected + 1 : ""} of {photos.length}</Dialog.Title>
          {photo && <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="90vw" className={styles.enlargedPhoto} />}
          <Dialog.Description className={photo?.caption ? styles.photoDescription : "sr-only"}>
            {photo?.caption || `Enlarged photograph ${selected !== null ? selected + 1 : ""}`}
          </Dialog.Description>
          {photos.length > 1 && <div className={styles.photoNavigation}>
            <button aria-label="Previous photo" disabled={selected === 0} onClick={() => setSelected((index) => Math.max(0, (index ?? 0) - 1))}><ArrowLeft size={22} /></button>
            <span>{(selected ?? 0) + 1} / {photos.length}</span>
            <button aria-label="Next photo" disabled={selected === photos.length - 1} onClick={() => setSelected((index) => Math.min(photos.length - 1, (index ?? 0) + 1))}><ArrowRight size={22} /></button>
          </div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </>;
}
