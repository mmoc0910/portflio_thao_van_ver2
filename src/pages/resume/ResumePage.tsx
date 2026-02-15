
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PdfToImages from "./items/PdfToImages";
import { contentApi } from "../../services/contentApi";
import type { AwardItem } from "../../types/content";
import { Link } from "react-router";

const pdfUrl = "/resume/resume.pdf";

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);

    onChange();
    // Safari fallback
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, [query]);

  return matches;
};

export const Resume = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  const [awards, setAwards] = useState<AwardItem[]>([]);
  const [isLoadingAwards, setIsLoadingAwards] = useState(true);
  const [awardsError, setAwardsError] = useState<string | null>(null);

  // responsive scale cho PDF (mobile nhẹ, desktop nét)
  const isSmUp = useMediaQuery("(min-width: 640px)");
  const isLgUp = useMediaQuery("(min-width: 1024px)");
  const pdfScale = useMemo(
    () => (isLgUp ? 2 : isSmUp ? 1.6 : 1.15),
    [isLgUp, isSmUp],
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const hero = heroRef.current;
    const text = textRef.current;
    if (!hero || !text) return;

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

    const loadAwards = async () => {
      try {
        setIsLoadingAwards(true);
        setAwardsError(null);

        const data = await contentApi.getAwards();
        if (!isMounted) return;

        setAwards(data);
      } catch {
        if (!isMounted) return;
        setAwardsError("Could not load awards.");
      } finally {
        if (isMounted) setIsLoadingAwards(false);
      }
    };

    void loadAwards();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDownload = useCallback(async () => {
    try {
      const res = await fetch(pdfUrl, { cache: "no-store" });
      if (!res.ok) throw new Error(`Download failed: ${res.status}`);

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "Resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
    }
  }, []);

  return (
    <div className="w-full">
      {/* HERO */}
      <div
        ref={heroRef}
        className="relative w-full overflow-hidden rounded-4xl border border-slate-200 bg-white/70 backdrop-blur"
        style={{ height: 420 }}
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1770297345804-e6af74ee764d?q=80&w=1600&auto=format&fit=crop"
            className="h-full w-full object-cover"
            alt="Resume banner"
            loading="eager"
          />
          <div className="absolute inset-0 bg-linear-to-br from-white/75 via-white/25 to-sky-200/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(56,189,248,0.20),transparent_45%),radial-gradient(circle_at_80%_25%,rgba(244,114,182,0.16),transparent_45%)]" />
        </div>

        <div className="relative flex h-full items-center justify-center px-4 sm:px-6">
          <div ref={textRef} className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white">
              Portfolio
            </p>
            <h1 className="mt-3 text-4xl sm:text-6xl font-semibold tracking-tight text-white">
              Resume
            </h1>
            <p className="mt-4 max-w-[70ch] text-sm sm:text-base text-white">
              View the full resume below and download a copy anytime.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="w-full sm:w-auto rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition"
              >
                Download PDF
              </button>
              <a
                href="#awards"
                className="w-full sm:w-auto text-center rounded-full bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-900 border border-slate-200 hover:bg-white transition"
              >
                Jump to Awards
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* PDF SECTION (responsive) */}
      <div className="w-full pt-8 sm:pt-10">
        <div className="px-4 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex flex-col gap-3 px-5 sm:px-6 py-5 border-b border-slate-200 bg-slate-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Resume PDF
                    </p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      Embedded preview
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto text-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
                    >
                      Open in new tab
                    </a>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="w-full sm:w-auto rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
                    >
                      Download
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  Tip: On mobile, preview is optimized for performance.
                </p>
              </div>

              <div className="px-3 sm:px-6 py-4 sm:py-6 bg-[#f1f0ee]">
                <PdfToImages
                  source={{ type: "url", url: pdfUrl }}
                  scale={pdfScale}
                />
              </div>

              <div className="px-5 sm:px-6 py-4 bg-white">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full rounded-2xl bg-primary text-white border border-primary py-2.5 text-sm font-semibold hover:opacity-95 transition"
                >
                  Download Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AWARDS */}
      <div
        id="awards"
        className="w-full px-4 sm:px-8 pt-12 sm:pt-14 pb-14 sm:pb-16"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Recognition
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Awards
            </h2>
            <p className="mt-3 max-w-[70ch] text-sm sm:text-base text-slate-600">
              Highlights of achievements and featured work.
            </p>
          </div>

          <div className="mt-8 sm:mt-10">
            {isLoadingAwards ? (
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 text-center text-sm text-slate-600">
                Loading awards...
              </div>
            ) : null}

            {awardsError ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700">
                {awardsError}
              </div>
            ) : null}

            {!isLoadingAwards && !awardsError && awards.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 text-center text-sm text-slate-600">
                No awards yet.
              </div>
            ) : null}

            {/* {awards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {awards.map((award) => (
                  <article
                    key={award._id}
                    className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition"
                  >
                    <div className="relative">
                      <img
                        src={award.imageUrl}
                        alt={award.title}
                        className="w-full aspect-[4/3] object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0" />
                    </div>

                    <div className="p-6 text-center space-y-2">
                      <p className="text-lg font-semibold text-slate-900">
                        {award.title}
                      </p>
                      <p className="text-sm text-slate-600">
                        {award.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : null} */}
            {awards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                {awards.map((award) => (
                  <div key={award._id} className="transition">
                    <div className="relative">
                      <img
                        src={award.imageUrl}
                        alt={award.title}
                        className="w-full aspect-4/3 object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/25 via-black/0 to-black/0" />
                    </div>

                    <div className="space-y-3 text-center mt-6">
                      <Link to={award.articleUrl ?? '#'} target={award.articleUrl ? "_blank" : undefined} className="block text-xl font-medium text-slate-900">
                        {award.title}
                      </Link>
                      <p className="text-sm text-slate-600">
                        {award.description}
                      </p>

                      {/* {award.articleUrl ? (
                        <a
                          href={award.articleUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition"
                        >
                          Read Article
                        </a>
                      ) : (
                        <div className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-400">
                          No Article Link
                        </div>
                      )} */}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
