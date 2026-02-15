
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contentApi } from "../../services/contentApi";
import type { PhotoItem } from "../../types/content";

type GalleryItem = {
  _id?: string;
  imageUrl: string;
  caption?: string;
};

const MasonryGrid = ({
  items,
  onSelect,
  className = "",
}: {
  items: GalleryItem[];
  onSelect?: (idx: number) => void;
  className?: string;
}) => {
  return (
    <div
      className={[
        "columns-1 sm:columns-2 lg:columns-3 gap-5 w-full",
        className,
      ].join(" ")}
    >
      {items.map((item, idx) => (
        <button
          key={item._id ?? idx}
          type="button"
          onClick={() => onSelect?.(idx)}
          className="mb-5 break-inside-avoid w-full text-left"
        >
          <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
            <div className="relative">
              <img
                src={item.imageUrl}
                alt={item.caption || `photo-${idx + 1}`}
                loading="lazy"
                className="w-full h-auto object-cover transition duration-300 group-hover:scale-[1.02]"
              />
              <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <div className="absolute inset-0 bg-linear-to-t from-black/25 via-black/0 to-black/0" />
              </div>
            </div>

            {/* {item.caption ? (
              <div className="px-4 py-3">
                <p className="text-sm text-slate-700 line-clamp-2">
                  {item.caption}
                </p>
              </div>
            ) : null} */}
          </div>
        </button>
      ))}
    </div>
  );
};

const SectionTitle = ({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) => (
  <div className="space-y-2">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
      {eyebrow}
    </p>
    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
      {title}
    </h2>
  </div>
);

export const Photography = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  const [behindScenes, setBehindScenes] = useState<PhotoItem[]>([]);
  const [campusEvents, setCampusEvents] = useState<PhotoItem[]>([]);
  const [portraitLandscape, setPortraitLandscape] = useState<PhotoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasAny = useMemo(
    () =>
      behindScenes.length + campusEvents.length + portraitLandscape.length > 0,
    [behindScenes.length, campusEvents.length, portraitLandscape.length],
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const hero = heroRef.current;
    const text = textRef.current;
    if (!hero || !text) return;

    // smooth shrink (premium feel)
    gsap.fromTo(
      hero,
      { height: 420 },
      {
        height: 140,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "+=520",
          scrub: true,
        },
      },
    );

    gsap.fromTo(
      text,
      { opacity: 1, y: 0, scale: 1 },
      {
        opacity: 0,
        y: -10,
        scale: 0.98,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "+=260",
          scrub: true,
        },
      },
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [behindScenesData, campusEventsData, portraitLandscapeData] =
          await Promise.all([
            contentApi.getBehindScenes(),
            contentApi.getCampusEvents(),
            contentApi.getPortraitLandscape(),
          ]);

        if (!isMounted) return;

        setBehindScenes(behindScenesData);
        setCampusEvents(campusEventsData);
        setPortraitLandscape(portraitLandscapeData);
      } catch {
        if (!isMounted) return;
        setError("Could not load photography content.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full">
      {/* HERO (full width) */}
      <div
        ref={heroRef}
        className="relative w-full overflow-hidden rounded-4xl border border-slate-200 bg-white/70 backdrop-blur"
        style={{ height: 420 }}
      >
        {/* soft gradient overlay (bright, no dark overlay) */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1770297345804-e6af74ee764d?q=80&w=1600&auto=format&fit=crop"
            className="h-full w-full object-cover"
            alt="Photography banner"
            loading="eager"
          />
          <div className="absolute inset-0 bg-linear-to-br from-white/70 via-white/20 to-fuchsia-200/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(56,189,248,0.25),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(244,114,182,0.22),transparent_45%)]" />
        </div>

        <div className="relative flex h-full items-center justify-center px-6">
          <div ref={textRef} className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
              Portfolio
            </p>
            <h1 className="mt-3 text-4xl sm:text-6xl font-semibold tracking-tight text-white">
              Photography
            </h1>
            <p className="mt-4 max-w-[70ch] text-sm sm:text-base text-white">
              A collection of travel photos, personal projects, and event
              photos.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <a
                href="#behind"
                className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-slate-900 border border-slate-200 hover:bg-white transition"
              >
                Behind the scenes
              </a>
              <a
                href="#events"
                className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-slate-900 border border-slate-200 hover:bg-white transition"
              >
                Campus events
              </a>
              <a
                href="#portraits"
                className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-slate-900 border border-slate-200 hover:bg-white transition"
              >
                Portrait & landscape
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT (full width) */}
      <div className="w-full pt-10">
        <div className="grid w-full gap-8 lg:grid-cols-[320px_1fr]">
          {/* TOC sticky (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white/80 p-6 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Table of contents
              </p>

              <div className="mt-4 space-y-2">
                <a
                  href="#behind"
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Behind the scenes
                </a>
                <a
                  href="#events"
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Campus Events
                </a>
                <a
                  href="#portraits"
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Portrait & Landscape
                </a>
              </div>
            </div>
          </aside>

          {/* Main sections */}
          <div className="w-full space-y-14">
            {/* Status */}
            {isLoading ? (
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 text-center text-sm text-slate-600">
                Loading photography content...
              </div>
            ) : null}

            {error ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            {!isLoading && !error && !hasAny ? (
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 text-center">
                <p className="text-base font-semibold text-slate-900">
                  No photos yet.
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Add content from your CMS/API and it will appear here
                  automatically.
                </p>
              </div>
            ) : null}

            {/* Sections */}
            <section id="behind" className="scroll-mt-28 space-y-6">
              <SectionTitle eyebrow="Collection" title="Behind the scenes" />
              {behindScenes.length > 0 ? (
                <MasonryGrid items={behindScenes} />
              ) : (
                <p className="text-sm text-slate-600">No photos yet.</p>
              )}
            </section>

            <section id="events" className="scroll-mt-28 space-y-6">
              <SectionTitle eyebrow="Collection" title="Campus Events" />
              {campusEvents.length > 0 ? (
                <MasonryGrid items={campusEvents} />
              ) : (
                <p className="text-sm text-slate-600">No photos yet.</p>
              )}
            </section>

            <section id="portraits" className="scroll-mt-28 space-y-6">
              <SectionTitle eyebrow="Collection" title="Portrait & Landscape" />
              {portraitLandscape.length > 0 ? (
                <MasonryGrid items={portraitLandscape} />
              ) : (
                <p className="text-sm text-slate-600">No photos yet.</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
