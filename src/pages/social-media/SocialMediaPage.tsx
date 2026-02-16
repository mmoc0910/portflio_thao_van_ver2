import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contentApi } from "../../services/contentApi";
import type { FeaturedWorkItem } from "../../types/content";
import { Link } from "react-router";

const PageHero = ({
  heroRef,
  textRef,
  title,
  subtitle,
  imageUrl,
}: {
  heroRef: React.RefObject<HTMLDivElement | null>;
  textRef: React.RefObject<HTMLDivElement | null>;
  title: string;
  subtitle: string;
  imageUrl: string;
}) => {
  return (
    <div
      ref={heroRef}
      className="relative w-full overflow-hidden rounded-4xl border border-slate-200 bg-white/70 backdrop-blur"
      style={{ height: 420 }}
    >
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          className="h-full w-full object-cover"
          alt={`${title} banner`}
          loading="eager"
        />
        <div className="absolute inset-0 bg-linear-to-br from-white/75 via-white/25 to-sky-200/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(56,189,248,0.20),transparent_45%),radial-gradient(circle_at_80%_25%,rgba(244,114,182,0.16),transparent_45%)]" />
      </div>

      <div className="relative flex h-full items-center justify-center px-6">
        <div ref={textRef} className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
            Portfolio
          </p>
          <h1 className="mt-3 text-4xl sm:text-6xl font-semibold tracking-tight text-slate-900 capitalize">
            {title}
          </h1>
          <p className="mt-4 max-w-[70ch] text-sm sm:text-base text-slate-600">
            {subtitle}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <a
              href="#videos"
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              Latest Videos
            </a>
            <a
              href="#connect"
              className="rounded-full bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-900 border border-slate-200 hover:bg-white transition"
            >
              Stay Connected
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
}) => (
  <div className="flex flex-col items-center text-center">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
      {eyebrow}
    </p>
    <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
      {title}
    </h2>
    {desc ? (
      <p className="mt-3 max-w-[70ch] text-sm sm:text-base text-slate-600">
        {desc}
      </p>
    ) : null}
  </div>
);

const SocialIconBtn = ({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    aria-label={label}
    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition"
  >
    {children}
  </a>
);

export const SocialMedia = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  // const [latestVideos, setLatestVideos] = useState<LatestVideoItem[]>([]);
  // const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  // const [videosError, setVideosError] = useState<string | null>(null);

  const [featuredWork, setFeaturedWork] = useState<FeaturedWorkItem[]>([]);
  const [isLoadingWork, setIsLoadingWork] = useState(true);
  const [workError, setWorkError] = useState<string | null>(null);

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

    const loadFeaturedWork = async () => {
      try {
        setIsLoadingWork(true);
        setWorkError(null);

        const data = await contentApi.getFeaturedWork();
        if (!isMounted) return;

        setFeaturedWork(data);
      } catch {
        if (!isMounted) return;
        setWorkError("Could not load featured work.");
      } finally {
        if (isMounted) setIsLoadingWork(false);
      }
    };

    void loadFeaturedWork();

    return () => {
      isMounted = false;
    };
  }, []);

  // useEffect(() => {
  //   let isMounted = true;

  //   const loadVideos = async () => {
  //     try {
  //       setIsLoadingVideos(true);
  //       setVideosError(null);

  //       const data = await contentApi.getLatestVideos();
  //       if (!isMounted) return;

  //       setLatestVideos(data);
  //     } catch {
  //       if (!isMounted) return;
  //       setVideosError("Could not load latest videos.");
  //     } finally {
  //       if (isMounted) setIsLoadingVideos(false);
  //     }
  //   };

  //   void loadVideos();
  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);

  return (
    <div className="w-full">
      {/* HERO */}
      <PageHero
        heroRef={heroRef}
        textRef={textRef}
        title="Social media and promotion"
        subtitle=""
        imageUrl="/images/z7537710835339_30e53144387439d54a48a94d622566af.jpg"
      />

      {/* VIDEOS */}
      <div id="videos" className="w-full px-4 sm:px-8 pt-12 pb-10">
        <div className="mx-auto max-w-6xl">
          {/* <SectionTitle
            eyebrow="Content"
            title="Latest Videos"
            // desc="Watch recent uploads and highlights."
          /> */}
          <SectionTitle
            eyebrow="Work"
            title="Featured Work"
            // desc="A selection of projects showcasing production, editing, and storytelling."
          />
          <div className="mt-10">
            {isLoadingWork ? (
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 text-center text-sm text-slate-600">
                Loading featured work...
              </div>
            ) : null}

            {workError ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700">
                {workError}
              </div>
            ) : null}

            {!isLoadingWork && !workError && featuredWork.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 text-center text-sm text-slate-600">
                No featured work yet.
              </div>
            ) : null}

            {featuredWork.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredWork.map((item) => (
                  <article key={item._id} className="transition flex flex-col">
                    <div className="relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full aspect-9/16 object-cover rounded-3xl"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-6 space-y-3 text-center flex-1 flex-col items-center justify-between">
                      <Link
                        to={item?.projectUrl ?? "#"}
                        target={item?.projectUrl ? "_blank" : undefined}
                        className="block text-xl text-slate-900 line-clamp-2"
                      >
                        {item.title}
                      </Link>
                      <p className="text-sm text-slate-600 line-clamp-3 mt-auto">
                        {item.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </div>
          {/* <div className="mt-10">
            {isLoadingVideos ? (
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 text-center text-sm text-slate-600">
                Loading latest videos...
              </div>
            ) : null}

            {videosError ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-700">
                {videosError}
              </div>
            ) : null}

            {!isLoadingVideos && !videosError && latestVideos.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 text-center text-sm text-slate-600">
                No videos yet.
              </div>
            ) : null}

            {latestVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestVideos.map((video) => (
                  <article key={video._id} className="transition flex flex-col">
                    <div className="relative w-full aspect-video bg-black">
                      <div className="absolute inset-0">
                        <YouTube
                          videoId={video.videoId}
                          opts={{
                            width: "100%",
                            height: "100%",
                            playerVars: { autoplay: 0 },
                          }}
                          className="h-full w-full"
                          iframeClassName="h-full w-full"
                        />
                      </div>
                    </div>

                    <div className="mt-6 space-y-2 flex flex-col items-center justify-between text-center flex-1">
                      <h3 className="text-xl text-slate-900 line-clamp-2">
                        {video.title}
                      </h3>
                      {video.description ? (
                        <p className="text-sm text-slate-600 line-clamp-3">
                          {video.description}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </div> */}
        </div>
      </div>

      {/* CONNECT */}
      <div id="connect" className="w-full px-4 sm:px-8 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-4xl border border-slate-200 bg-white/80 backdrop-blur p-8 sm:p-10">
            <SectionTitle
              eyebrow="Community"
              title="Stay Connected"
              desc="Subscribe for upcoming videos and follow me on social media so we can stay connected."
            />

            <div className="mt-8 flex items-center justify-center gap-3">
              <SocialIconBtn
                href="https://www.instagram.com/van_vtvn/"
                label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                  className="h-6 w-6"
                >
                  <path d="M320.3 205C256.8 204.8 205.2 256.2 205 319.7C204.8 383.2 256.2 434.8 319.7 435C383.2 435.2 434.8 383.8 435 320.3C435.2 256.8 383.8 205.2 320.3 205zM319.7 245.4C360.9 245.2 394.4 278.5 394.6 319.7C394.8 360.9 361.5 394.4 320.3 394.6C279.1 394.8 245.6 361.5 245.4 320.3C245.2 279.1 278.5 245.6 319.7 245.4zM413.1 200.3C413.1 185.5 425.1 173.5 439.9 173.5C454.7 173.5 466.7 185.5 466.7 200.3C466.7 215.1 454.7 227.1 439.9 227.1C425.1 227.1 413.1 215.1 413.1 200.3zM542.8 227.5C541.1 191.6 532.9 159.8 506.6 133.6C480.4 107.4 448.6 99.2 412.7 97.4C375.7 95.3 264.8 95.3 227.8 97.4C192 99.1 160.2 107.3 133.9 133.5C107.6 159.7 99.5 191.5 97.7 227.4C95.6 264.4 95.6 375.3 97.7 412.3C99.4 448.2 107.6 480 133.9 506.2C160.2 532.4 191.9 540.6 227.8 542.4C264.8 544.5 375.7 544.5 412.7 542.4C448.6 540.7 480.4 532.5 506.6 506.2C532.8 480 541 448.2 542.8 412.3C544.9 375.3 544.9 264.5 542.8 227.5zM495 452C487.2 471.6 472.1 486.7 452.4 494.6C422.9 506.3 352.9 503.6 320.3 503.6C287.7 503.6 217.6 506.2 188.2 494.6C168.6 486.8 153.5 471.7 145.6 452C133.9 422.5 136.6 352.5 136.6 319.9C136.6 287.3 134 217.2 145.6 187.8C153.4 168.2 168.5 153.1 188.2 145.2C217.7 133.5 287.7 136.2 320.3 136.2C352.9 136.2 423 133.6 452.4 145.2C472 153 487.1 168.1 495 187.8C506.7 217.3 504 287.3 504 319.9C504 352.5 506.7 422.6 495 452z" />
                </svg>
              </SocialIconBtn>

              <SocialIconBtn
                href="https://www.linkedin.com/in/van-vo-035652337"
                label="YouTube"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                  className="h-6 w-6"
                >
                  <path d="M196.3 512L103.4 512L103.4 212.9L196.3 212.9L196.3 512zM149.8 172.1C120.1 172.1 96 147.5 96 117.8C96 103.5 101.7 89.9 111.8 79.8C121.9 69.7 135.6 64 149.8 64C164 64 177.7 69.7 187.8 79.8C197.9 89.9 203.6 103.6 203.6 117.8C203.6 147.5 179.5 172.1 149.8 172.1zM543.9 512L451.2 512L451.2 366.4C451.2 331.7 450.5 287.2 402.9 287.2C354.6 287.2 347.2 324.9 347.2 363.9L347.2 512L254.4 512L254.4 212.9L343.5 212.9L343.5 253.7L344.8 253.7C357.2 230.2 387.5 205.4 432.7 205.4C526.7 205.4 544 267.3 544 347.7L544 512L543.9 512z" />
                </svg>
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                  className="h-6 w-6"
                >
                  <path d="M581.7 188.1C575.5 164.4 556.9 145.8 533.4 139.5C490.9 128 320.1 128 320.1 128C320.1 128 149.3 128 106.7 139.5C83.2 145.8 64.7 164.4 58.4 188.1C47 231 47 320.4 47 320.4C47 320.4 47 409.8 58.4 452.7C64.7 476.3 83.2 494.2 106.7 500.5C149.3 512 320.1 512 320.1 512C320.1 512 490.9 512 533.5 500.5C557 494.2 575.5 476.3 581.8 452.7C593.2 409.8 593.2 320.4 593.2 320.4C593.2 320.4 593.2 231 581.8 188.1zM264.2 401.6L264.2 239.2L406.9 320.4L264.2 401.6z" />
                </svg> */}
              </SocialIconBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
