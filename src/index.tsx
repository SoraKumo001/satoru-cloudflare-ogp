/** @jsx h */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, toHtml } from "satoru-render/preact";
import { render } from "satoru-render";
import { createCSS } from "satoru-render/tailwind";

const fetch = async (
  request: Request,
  _env: object,
  ctx: ExecutionContext,
): Promise<Response> => {
  const url = new URL(request.url);
  if (url.pathname !== "/") {
    return new Response(null, { status: 404 });
  }
  const subtitle = url.searchParams.get("subtitle") ?? "subtitle";
  const title = url.searchParams.get("title") ?? "Title";
  const image =
    url.searchParams.get("image") ??
    "https://raw.githubusercontent.com/SoraKumo001/cloudflare-ogp/refs/heads/master/sample/image.jpg";
  const cache = await caches.open("satoru-cloudflare-ogp");
  const cacheKey = new Request(url.toString());
  const isDev =
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.searchParams.has("nocache");
  const cachedResponse = isDev ? null : await cache.match(cacheKey);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Define OGP layout using JSX
  // We include @font-face in a style tag inside the HTML
  const html = toHtml(
    <html className="m-0 p-0">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="m-0 p-0 font-sans">
        <style>
          {`
          body {
            font-family: 'Noto Sans JP', 'emoji';
          }
          `}
        </style>
        <div className="relative flex h-157.5 w-300 overflow-hidden bg-[#0f172a]">
          {/* Background Decorative Elements with Glow */}
          <div className="absolute -left-25 -top-25 flex size-150 rounded-full bg-indigo-600/20 blur-[100px]" />
          <div className="absolute -bottom-37.5 right-25 flex size-175 rounded-full bg-purple-600/15 blur-[120px]" />

          {/* Main Content Area */}
          <div className="z-10 flex size-full flex-row items-center justify-between p-15">
            {/* Left Content Card with Backdrop Filter (Glassmorphism) */}
            <div className="flex w-[62%] flex-col rounded-[48px] border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-2xl">
              <div className="mb-8 flex items-center">
                <div className="mr-5 h-1.5 w-16 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.6)]" />
                <div className="flex text-xl font-bold uppercase tracking-[0.25em] text-indigo-300 drop-shadow-md">
                  Insight & Technology
                </div>
              </div>

              {/* Title with strong Drop Shadow */}
              <div className="mb-8 flex wrap-break-word text-[76px] font-black leading-[1.1] text-white drop-shadow-[0_12px_12px_rgba(0,0,0,0.6)]">
                {title}
              </div>

              {/* Subtitle with subtle Drop Shadow */}
              <div className="flex -rotate-4 underline decoration-wavy underline-offset-8 text-[30px] font-medium leading-relaxed text-slate-300 opacity-90 drop-shadow-lg">
                {subtitle}
              </div>

              <div className="mt-12 flex items-center gap-4">
                <div className="flex rounded-2xl border border-indigo-500/30 bg-indigo-500/20 px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-indigo-100 shadow-inner">
                  Cloudflare
                </div>
                <div className="flex rounded-2xl border border-purple-500/30 bg-purple-500/20 px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-purple-100 shadow-inner">
                  OGP Generator
                </div>
              </div>
            </div>

            {/* Right Image Container with Drop Shadow and Layering */}
            <div className="relative flex w-[33%] items-center justify-center">
              {/* Outer Glow Ring */}
              <div className="absolute flex size-115 rounded-full bg-indigo-500/10 blur-[50px]" />

              {/* Image Frame with multiple shadows */}
              <div className="flex size-105 rotate-3 overflow-hidden rounded-[56px] border-4 border-white/20 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.9)] drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]">
                <img
                  className="size-full scale-110 object-cover"
                  src={image}
                  alt=""
                />
              </div>

              {/* Decorative Floating Icon with Glass effect */}
              <div className="absolute -bottom-7.5 -right-2.5 flex size-28 -rotate-12 items-center justify-center rounded-4xl shadow-2xl backdrop-blur-md">
                <div className="flex text-5xl font-bold text-white drop-shadow-lg">
                  ⭐️
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Branding with Backdrop Filter */}
          <div className="absolute bottom-10 left-21.25 z-20 flex items-center">
            <div className="flex rounded-2xl border border-white/10 bg-slate-900/40 px-8 py-3 text-xl font-bold text-slate-100 shadow-xl backdrop-blur-xl">
              <span className="mr-2 flex text-indigo-400">@</span>
              satoru-cloudflare-ogp
            </div>
          </div>
        </div>
      </body>
    </html>,
  );

  // Render to PNG with automatic font resolution
  const png = await render({
    value: html,
    css: await createCSS(html),
    width: 1200,
    height: 630,
    format: "png",
  });
  const response = new Response(png as BodyInit, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": isDev
        ? "no-cache, no-store, must-revalidate"
        : "public, max-age=31536000, immutable",
      date: new Date().toUTCString(),
    },
    cf: isDev
      ? { cacheEverything: false, cacheTtl: 0 }
      : {
          cacheEverything: true,
          cacheTtl: 31536000,
        },
  });
  if (!isDev) {
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
  }
  return response;
};

export default {
  fetch,
};
