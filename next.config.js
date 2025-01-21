const nextConfig = {
  output: "export",
  /**
   * Disable server-based image optimization. Next.js does not support
   * dynamic features with static exports.
   *
   * @see https://nextjs.org/docs/app/api-reference/components/image#unoptimized
   */
    // Only add basePath in production
    ...(process.env.NODE_ENV === "production" && {
      basePath: "/transcript-editor",
    }),
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
