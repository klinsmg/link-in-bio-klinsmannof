import type { NextConfig } from "next";

// Site 100% estático (pasta `out/`). BASE_PATH só é necessário no GitHub Pages de projeto.
const basePath = process.env.BASE_PATH ?? "";

const config: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath,
  env: { NEXT_PUBLIC_BASE: basePath }, // para o vídeo de fundo, que não passa pelo next/image
};

export default config;
