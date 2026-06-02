/** @type {import('next').NextConfig} */

// When deploying to GitHub Pages the site is served from a subpath
// (https://<user>.github.io/<repo>). Set NEXT_PUBLIC_BASE_PATH at build time.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const nextConfig = {
  // Produce a fully static site in `out/` so it can be hosted on GitHub Pages.
  output: 'export',
  basePath,
  // GitHub Pages serves each route as a folder with index.html.
  trailingSlash: true,
  images: {
    // GitHub Pages has no image optimizer; serve images as-is.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
    ],
  },
};

export default nextConfig;
