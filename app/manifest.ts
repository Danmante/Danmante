import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return { name: "Danmante", short_name: "Danmante", description: "Healthcare access, connected.", start_url: `${basePath}/`, display: "standalone", background_color: "#f7fafb", theme_color: "#0b3954", icons: [{ src: `${basePath}/icon.svg`, sizes: "any", type: "image/svg+xml" }] };
}
