"use client";

import { useCallback, useEffect, useReducer, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { getImageProps } from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, BookmarkSimple, Check, Flower, Heart, List, Sparkle, X } from "@phosphor-icons/react";
import { birthday } from "@/content/birthday";
import { contributors } from "@/content/contributors";
import { initialNavigation, navigationReducer } from "@/lib/navigation";
import type { Contributor } from "@/lib/types";
import { Binding, Botanical, HandUnderline, ScatteredDecor, SketchArrow, Tape } from "../scrapbook/Decorations";
import { Polaroid } from "../scrapbook/Polaroid";
import { Envelope, PhotoGallery } from "../readers/Readers";
import styles from "./book.module.css";

const READ_KEY = "birthday-scrapbook-read-v1";
const READ_EVENT = "birthday-read-change";
function subscribeRead(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(READ_EVENT, callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener(READ_EVENT, callback); };
}
function readSnapshot() {
  try { return localStorage.getItem(READ_KEY) || ""; } catch { return ""; }
}
function parseRead(value: string): string[] {
  try { const parsed: unknown = JSON.parse(value); return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : []; } catch { return []; }
}

export function BirthdayBook() {
  const [opened, setOpened] = useState(false);
  const [readingView, setReadingView] = useState(false);
  const [state, dispatch] = useReducer(navigationReducer, initialNavigation);
  const reducedMotion = useReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const read = parseRead(useSyncExternalStore(subscribeRead, readSnapshot, () => ""));
  const lastPage = contributors.length + (birthday.closingLetter ? 1 : 0);
  const person = contributors[state.current - 1];
  const go = useCallback((target: number, direct = false) => {
    dispatch({ type: "go", target, lastPage, reducedMotion: !!reducedMotion || readingView, direct });
  }, [lastPage, reducedMotion, readingView]);

  useEffect(() => {
    const destination = contributors[state.target - 1];
    if (!destination) return;
    // Warm the same responsive image URL that Next Image will select on arrival.
    for (const photo of destination.photos.slice(0, 2)) {
      const { props } = getImageProps({ src: photo.src, width: photo.width, height: photo.height, alt: photo.alt, sizes: "(max-width: 700px) 70vw, 350px" });
      const image = new window.Image();
      if (props.sizes) image.sizes = props.sizes;
      if (props.srcSet) image.srcset = props.srcSet;
      image.src = props.src;
    }
  }, [state.target]);

  useEffect(() => {
    if (!state.turning) return;
    const timer = setTimeout(() => dispatch({ type: reducedMotion ? "skip" : "step" }), reducedMotion ? 0 : state.duration);
    return () => clearTimeout(timer);
  }, [state.turning, state.current, state.duration, reducedMotion]);

  useEffect(() => {
    if (!opened || state.turning) return;
    const timer = setTimeout(() => {
      contentRef.current?.scrollTo({ top: 0 });
      contentRef.current?.querySelector<HTMLElement>("[data-page-heading]")?.focus({ preventScroll: true });
    }, 80);
    return () => clearTimeout(timer);
  }, [opened, state.current, state.turning]);

  useEffect(() => {
    if (!opened) return;
    const keydown = (event: KeyboardEvent) => {
      if (document.querySelector('[role="dialog"]') || event.altKey || event.ctrlKey || event.metaKey) return;
      if ((event.target as HTMLElement)?.closest("input, textarea, select, [contenteditable=true]")) return;
      if (event.key === "ArrowRight") { event.preventDefault(); go(state.current + 1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); go(state.current - 1); }
      if (event.key === "Home") { event.preventDefault(); go(0); }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [opened, state.current, go]);

  function markRead(id: string) {
    try {
      localStorage.setItem(READ_KEY, JSON.stringify([...new Set([...parseRead(readSnapshot()), id])]));
      window.dispatchEvent(new Event(READ_EVENT));
    } catch { /* Reading stays available when browser storage is disabled. */ }
  }

  return <MotionConfig reducedMotion="user">
    <main className={styles.scene}>
      <header className={styles.siteHeader}>
        <div className={styles.wordmark}><Flower size={25} weight="thin" /><span>a little book of you<span className={styles.wordmarkDot}>.</span></span></div>
        <span className={styles.headerDedication}>{birthday.dedication} <Heart size={12} weight="fill" /></span>
      </header>

      <div className={styles.stage}>
        {!opened && <div className={styles.marginNote} aria-hidden="true"><span>some things deserve<br />to be kept forever.</span><SketchArrow /></div>}
        <motion.div layout transition={{ duration: reducedMotion ? 0 : .65, ease: [.22, 1, .36, 1] }}
          className={`${styles.book} ${opened ? styles.openBook : styles.closedBook} ${readingView ? styles.readingView : ""}`}>
          <AnimatePresence mode="wait" initial={false}>
            {!opened ? <motion.section key="cover" className={styles.cover}
              initial={false} exit={{ rotateY: reducedMotion ? 0 : -95, opacity: 0 }}
              transition={{ duration: reducedMotion ? .05 : .75, ease: [.4, 0, .2, 1] }}>
              <Binding />
              <ScatteredDecor />
              <p className={styles.coverDate}>{birthday.dateLabel}</p>
              <div className={styles.coverTitle}><span>A LITTLE CELEBRATION OF</span><h1>{birthday.name}</h1><p>Happy Birthday</p></div>
              <Polaroid cover photo={birthday.coverPhoto} />
              <div className={styles.coverAnnotation}><SketchArrow /><span>our favorite person.</span></div>
              <button className={styles.openButton} onClick={() => setOpened(true)}>Open your birthday book <ArrowRight size={20} /></button>
              <span className={styles.coverFootnote}>{contributors.length} people. a whole lot of love.</span>
            </motion.section> : <motion.section key="inside" className={styles.inside} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .25 }} aria-label="Birthday scrapbook"
              onAnimationComplete={() => contentRef.current?.querySelector<HTMLElement>("[data-page-heading]")?.focus({ preventScroll: true })}>
              <h1 className="sr-only">{birthday.name}&apos;s birthday scrapbook</h1>
              <Binding center />
              <div className={styles.bookTabs}>
                <button className={state.current === 0 ? styles.activeTab : ""} onClick={() => go(0, true)} disabled={state.turning} aria-label="Go to index"><List size={16} /><span>index</span></button>
                <button className={person?.group === "friends" ? styles.activeTab : ""} onClick={() => go(1, true)} disabled={state.turning}>friends</button>
                <button className={person?.group === "family" ? styles.activeTab : ""} onClick={() => go(contributors.findIndex((entry) => entry.group === "family") + 1, true)} disabled={state.turning}>family</button>
              </div>
              <div ref={contentRef} className={styles.pageViewport}
                onTouchStart={(event) => {
                  if ((event.target as HTMLElement).closest("button, a")) return;
                  touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
                }} onTouchEnd={(event) => {
                  const start = touchStart.current;
                  touchStart.current = null;
                  if (!start) return;
                  const dx = event.changedTouches[0].clientX - start.x;
                  const dy = event.changedTouches[0].clientY - start.y;
                  if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.8) go(state.current + (dx < 0 ? 1 : -1));
                }}>
                <div inert={state.turning} aria-hidden={state.turning || undefined} className={styles.pageContents}>
                  {state.current === 0 ? <IndexPage onGo={go} read={read} />
                    : person ? <ContributorPage key={person.id} person={person} onRead={markRead} readingView={readingView} />
                      : <ClosingPage />}
                </div>
                {state.turning && <motion.div key={`${state.current}-${state.direction}`} className={styles.turningSheet} aria-hidden="true"
                  initial={{ rotateY: state.direction === 1 ? 0 : -160 }} animate={{ rotateY: state.direction === 1 ? -160 : 0 }}
                  transition={{ duration: state.duration / 1000, ease: "easeInOut" }}>
                  <span>{state.direction === 1 ? state.current + 1 : state.current}</span>
                </motion.div>}
              </div>
            </motion.section>}
          </AnimatePresence>
        </motion.div>
        {!opened && <div className={styles.sideStamp} aria-hidden="true"><Heart size={19} weight="thin" /><span>HANDLE<br />WITH LOVE</span></div>}
      </div>

      {opened ? <div className={styles.controls}>
        <div className={styles.utilityControls}>
          <button onClick={() => { dispatch({ type: "skip" }); setOpened(false); }} aria-label="Close book"><X size={17} /><span>close book</span></button>
          <button onClick={() => { dispatch({ type: "skip" }); setReadingView((value) => !value); }} aria-pressed={readingView}><BookOpen size={18} /><span>{readingView ? "book view" : "reading view"}</span></button>
        </div>
        <nav className={styles.pageNavigation} aria-label="Book navigation">
          <button onClick={() => go(state.current - 1)} disabled={state.current === 0 || state.turning} aria-label="Previous page"><ArrowLeft size={20} /></button>
          <span>{state.current === 0 ? "the beginning" : person ? `${String(state.current).padStart(2, "0")} / ${contributors.length}` : "one last thing"}</span>
          <button onClick={() => go(state.current + 1)} disabled={state.current === lastPage || state.turning} aria-label="Next page"><ArrowRight size={20} /></button>
        </nav>
        {state.turning && <button className={styles.skipButton} onClick={() => dispatch({ type: "skip" })}>Skip animation <ArrowRight size={16} /></button>}
      </div> : <p className={styles.belowBook}><Sparkle size={14} /> a few pages, a thousand little reasons you&apos;re loved <Sparkle size={14} /></p>}

      <p className="sr-only" role="status" aria-live="polite">{opened && !state.turning ? state.current === 0 ? "Index. Choose a letter." : person ? `Page ${state.current}. A letter from ${person.name}.` : "Closing letter." : ""}</p>
      <footer className={styles.footer}><span>A KEEPSAKE, JUST FOR YOU</span><Heart size={11} weight="fill" /><span>{birthday.status === "draft" ? "DRAFT · YOUR MEMORIES GO HERE" : "TO COME BACK TO, ALWAYS"}</span></footer>
    </main>
  </MotionConfig>;
}

function IndexPage({ onGo, read }: { onGo: (page: number) => void; read: string[] }) {
  return <div className={styles.spread}>
    <div className={`${styles.page} ${styles.introPage}`}>
      <p className={styles.eyebrow}>THE VERY FIRST PAGE</p>
      <h2 tabIndex={-1} data-page-heading className={styles.introTitle}>All your people.<br /><HandUnderline>All this love.</HandUnderline></h2>
      <p className={styles.introCopy}>A little collection of the people,<br />the moments, and the love<br />that make your world yours.</p>
      <div className={styles.indexKeepsake}><Tape sage /><span className={styles.noteNumber}>{contributors.length}</span><span>little letters<br />for one very loved you</span><Heart size={19} weight="thin" /></div>
      <Botanical className={styles.indexBotanical} />
      <p className={styles.handNote}>Pick a name.<br />There&apos;s a little love waiting.</p>
      <span className={styles.pageNumber}>a book worth keeping</span>
    </div>
    <div className={`${styles.page} ${styles.indexPage}`}>
      <div className={styles.indexHeading}><h3>the people in these pages</h3><BookmarkSimple size={22} weight="thin" /></div>
      {(["friends", "family"] as const).map((group) => <section className={styles.nameGroup} key={group} aria-label={group}>
        <h4>{group === "friends" ? "the friends" : "the family"}<span>{group === "friends" ? "the ones you found" : "the ones who were always there"}</span></h4>
        <div className={styles.nameGrid}>{contributors.filter((p) => p.group === group).map((p) => <button key={p.id} onClick={() => onGo(p.order + 1)} aria-label={`Read ${p.name}'s page`}>
          <span>{p.name}</span><span className={styles.nameDots} /><span className={styles.nameNumber}>{read.includes(p.id) ? <Check size={12} aria-label="Read" /> : String(p.order + 1).padStart(2, "0")}</span>
        </button>)}</div>
      </section>)}
      <p className={styles.indexHint}>tap a name & go to their page <ArrowUpRight size={16} /></p>
    </div>
  </div>;
}

function ContributorPage({ person, onRead, readingView }: { person: Contributor; onRead: (id: string) => void; readingView: boolean }) {
  const photos = person.photos.length ? person.photos : birthday.coverPhoto ? [birthday.coverPhoto] : [];
  return <div className={`${styles.spread} ${styles.contributorSpread}`}>
    <div className={`${styles.page} ${styles.letterPage}`}>
      <p className={styles.eyebrow}>{person.group === "family" ? "FROM THE ONES WHO WERE ALWAYS THERE" : "FROM THE ONES YOU FOUND"}</p>
      <span className={styles.fromLabel}>a little love, from</span>
      <h2 data-page-heading tabIndex={-1} className={styles.personName}><HandUnderline>{person.name}</HandUnderline></h2>
      {readingView ? <div className={styles.inlineLetter}>{person.message.length ? person.message.map((p, index) => <p key={index}>{p}</p>) : <p className={styles.draftMessage}>Draft placeholder: {person.name}&apos;s letter is waiting to be added.</p>}</div>
        : <><Envelope person={person} onRead={onRead} /><p className={styles.envelopeHint}>a note with your name on it <Heart size={13} /><span>tap the envelope to open</span></p></>}
      <div className={styles.letterFooter}><Flower size={27} weight="thin" /><span>some words are worth keeping.</span></div>
      <span className={styles.pageNumber}>{String(person.order + 1).padStart(2, "0")} · {person.name}</span>
    </div>
    <div className={`${styles.page} ${styles.memoriesPage}`}>
      <div className={styles.memoriesHeading}><span>little moments,<br />lovely memories.</span><Sparkle size={23} weight="thin" /></div>
      {photos.length ? <PhotoGallery photos={photos} layout={person.layout} compact /> : <div className={styles.emptyMemories}>
        {birthday.status === "draft" ? <><Polaroid index={person.order} /><span className={styles.photoDraftLabel}>PHOTO PLACEHOLDER</span></> : <Botanical />}
        <p>{birthday.status === "draft" ? "a space saved for your memories" : "a little love, pressed between the pages"}</p>
      </div>}
      <Botanical className={styles.memoriesBotanical} />
      <span className={styles.memoryFootnote}>the ordinary moments are the good ones.</span>
    </div>
  </div>;
}

function ClosingPage() {
  const [celebrated, setCelebrated] = useState(false);
  const reducedMotion = useReducedMotion();
  const closing = birthday.closingLetter;
  if (!closing) return null;
  async function celebrate() {
    setCelebrated(true);
    if (reducedMotion) return;
    const confetti = (await import("canvas-confetti")).default;
    confetti({ particleCount: 65, spread: 65, origin: { y: .65 }, colors: ["#c98573", "#94a77f", "#ead8b4"], disableForReducedMotion: true });
  }
  return <div className={styles.spread}>
    <div className={`${styles.page} ${styles.closingPage}`}>
      <Heart size={35} weight="thin" /><h2 data-page-heading tabIndex={-1}>And a little love<br /><HandUnderline>from me.</HandUnderline></h2>
      <div className={styles.inlineLetter}>{closing.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
      <span className={styles.handNote}>with all my love, {closing.from}</span>
    </div>
    <div className={`${styles.page} ${styles.closingPage}`}><Botanical /><h3>Here&apos;s to you,<br />{birthday.name}.</h3><button className={styles.celebrateButton} onClick={celebrate}><Sparkle size={20} />{celebrated ? "A little more birthday magic" : "Make a little birthday wish"}</button></div>
  </div>;
}
