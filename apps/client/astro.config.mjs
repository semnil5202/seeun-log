import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://seeun-log.com",
  trailingSlash: "always",
  i18n: {
    defaultLocale: "ko",
    locales: ["ko", "en", "ja", "zh-CN", "zh-TW", "id", "vi", "th"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
