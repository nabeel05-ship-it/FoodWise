import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://food-wise-cp.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/contact", "/privacy-policy", "/terms"],
        disallow: [
          "/hotel/",
          "/household/",
          "/ngo/",
          "/kitchen/",
          "/dashboard/",
          "/settings/",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
