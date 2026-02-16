import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { contentApi } from "../../services/contentApi";

export const Home = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const defaultHomeIntro =
    "";
  const [homeIntroDescription, setHomeIntroDescription] = useState(defaultHomeIntro);

  useEffect(() => {
    if (!heroRef.current || !gridRef.current) return;

    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.75, ease: "power2.out" },
    );

    gsap.fromTo(
      gridRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.85, ease: "power2.out", delay: 0.08 },
    );
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadHomeIntro = async () => {
      try {
        const items = await contentApi.getHomeIntros();
        if (!isMounted || items.length === 0) return;

        const introDescription = items[0]?.description?.trim();
        if (introDescription) {
          setHomeIntroDescription(introDescription);
        }
      } catch {
        // Keep fallback content when API is unavailable.
      }
    };

    void loadHomeIntro();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full space-y-12">
      {/* HERO full width */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden rounded-4xl border border-slate-200 bg-white/70 backdrop-blur"
      >
        <div className="grid w-full gap-8 p-6 sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            {/* <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Content Creator • Podcaster • Filmmaker
            </p> */}

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl uppercase">
              {/* I create <span className="text-primary">bright</span>, modern
              stories for film & social media. */}
             about me
            </h1>

            <p className="mt-4 max-w-[70ch] whitespace-pre-line text-base text-slate-600">
              {homeIntroDescription}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {/* <a
                href="mailto:vtv.vansally@gmail.com"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition"
              >
                Work inquiry
              </a> */}

              <Link
                to="/resume"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
              >
                View resume
              </Link>

              <Link
                to="/photography"
                className="inline-flex items-center justify-center rounded-full bg-primary/10 px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/15 transition"
              >
                Explore work
              </Link>
            </div>

            {/* <div className="mt-6 flex flex-wrap gap-2 text-xs">
              {[
                "Video Production",
                "Filmmaking",
                "Social Media",
                "Photography",
                "Graphic Design",
              ].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700"
                >
                  {t}
                </span>
              ))}
            </div> */}
          </div>

          {/* Featured visual */}
          <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white">
            <div className="absolute inset-0 bg-linear-to-br from-sky-200/40 via-white to-fuchsia-200/40" />
            <img
              src="/images/z7537654450271_ca56832bba176e0e44a193fca4f37fd6.jpg"
              alt="Featured"
              className="relative h-60 w-full object-cover sm:h-90"
              loading="eager"
            />
            <div className="relative border-t border-slate-200 bg-white/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Featured project
              </p>
              <p className="mt-2 text-lg font-semibold tracking-tight">
                We Love You Now | Short Slasher 2025
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Behind-the-Scenes and Poster Photographer for the short film
                project, documenting production moments and creating official
                promotional visuals.
              </p>

              <div className="mt-4 flex gap-2">
                <Link
                  to="/photography#behind"
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
                >
                  View
                </Link>
                {/* <Link
                  to="/photography"
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
                >
                  More
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards row full width */}
      <section ref={gridRef} className="grid w-full gap-5 sm:grid-cols-3">
        {[
          {
            title: "Photography",
            desc: "Event, behind-the-scenes, graduation, and promotional photography with a focus on storytelling and atmosphere.",
            url: "/photography",
          },
          {
            title: "Social media & promotion",
            desc: "Content planning and visual production for event promotion and campus-based campaigns.",
            url: "/social-media-promotion",
          },
          {
            title: "Media production",
            desc: "Short-form video production, maintaining cohesive visual storytelling.",
            url: "/media-production",
          },
        ].map((c) => (
          <div
            key={c.title}
            className="rounded-[28px] border border-slate-200 bg-white/80 p-6 backdrop-blur hover:shadow-sm transition"
          >
            <p className="text-lg font-semibold tracking-tight capitalize">{c.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {c.desc}
            </p>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Available
              </span>
              <Link
                to={c.url}
                className="h-9 w-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 17L17 7M17 7H9M17 7V15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Contact section full width */}
      <section className="w-full rounded-4xl border border-slate-200 bg-white/80 p-6 backdrop-blur sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Contact me
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Stay connected so we can create creative projects together!
            </p>

            <div className="mt-5 space-y-2 text-sm">
              <p className="text-slate-700">
                <span className="font-semibold">Email:</span>{" "}
                <a
                  className="underline underline-offset-4 hover:text-slate-900"
                  href="mailto:vtv.vansally@gmail.com"
                >
                  vtv.vansally@gmail.com
                </a>{" "}
                {/* <span className="text-slate-500">(work inquiry)</span> */}
              </p>

              <p className="text-slate-700">
                <span className="font-semibold">Phone:</span>{" "}
                <span className="underline underline-offset-4 hover:text-slate-900">
                  (918) 904-0346
                </span>
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="mailto:contact.bettylam@gmail.com"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition"
              >
                Email me
              </a>
              <Link
                to="/resume"
                className="inline-flex items-center justify-center rounded-full bg-primary/10 px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/15 transition"
              >
                Resume
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
            <img
              src="/images/z7537656285369_f9be715d0fc0afeff92e82315151954b.jpg"
              alt="Contact"
              className="h-60 w-full object-cover sm:h-125"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
