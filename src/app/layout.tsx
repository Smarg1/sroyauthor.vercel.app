import "@/styles/globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import localFont from "next/font/local";

export const metadata = {
  title: "Sangita Roy | Author",
  description: "Discover the enchanting world of Sangita Roy, a nature-fiction author blending nature and imagination through fiction.",
  authors: [{ name: "Sangita Roy" }],
  robots: "index, follow",
  generator: "Smarg1 (Firefly)",
  openGraph: {
    type: "website",
    url: "https://sroyauthor.vercel.app",
    siteName: "sroyauthor",
    title: "Sangita Roy",
    description: "Discover the enchanting world of Sangita Roy, a nature-fiction author blending nature and imagination through fiction.",
    images: [
      {
        url: "https://sroyauthor.vercel.app/sp.png",
        width: 1200,
        height: 630,
        alt: "Sangita Roy | Author",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sangita Roy | Author",
    description: "Discover the enchanting world of Sangita Roy, a nature-fiction author blending nature and imagination through fiction.",
    images: ["https://sroyauthor.vercel.app/sp.png"],
  },
  manifest: "/images/favicon/manifest.json",
  icons: {
    icon: [
      { url: "/images/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/images/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/images/favicon/favicon.ico" },
    ],
    apple: "/images/favicon/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://sroyauthor.vercel.app/",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  themeColor: "#d9c4b0",
};

const quicksand = localFont({
  src: [
    { path: "../fonts/Quicksand-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Quicksand-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-quicksand",
  display: "swap",
});

const radley = localFont({
  src: [
    { path: "../fonts/Radley-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Radley-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-radley",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${quicksand.variable} ${radley.variable}`}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="apple-mobile-web-app-title" content="S.Roy" />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
