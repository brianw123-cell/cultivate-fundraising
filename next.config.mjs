/** @type {import('next').NextConfig} */
const nextConfig = {
  // Quality gates ON: the build fails on type or lint errors. (Previously these
  // were ignored as a demo speed hack; the codebase now type-checks and lints
  // clean, so the escape hatches are removed.)
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
