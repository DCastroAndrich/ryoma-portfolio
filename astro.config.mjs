import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";

import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://ryomadev.com",

  output: "static",

  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),

  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        page !== "https://ryomadev.com/privacy/" && page !== "https://ryomadev.com/terms/",
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
