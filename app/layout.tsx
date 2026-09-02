import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fragment_Mono } from "next/font/google";
import "./globals.css";
import "./site.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const fragment = Fragment_Mono({
  variable: "--font-fragment",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.datajagers.nl"),
  title: "Datajagers — Begrijpelijke data voor scherpere beslissingen",
  description:
    "Datajagers maakt data begrijpelijk en besluitvorming scherper. Procesoptimalisatie, dashboards en AI-workflows — gebouwd mét je team, zodat het blijft werken.",
  icons: { icon: "/assets/logo_mark.svg", apple: "/assets/logo_mark.svg" },
  openGraph: {
    type: "website",
    siteName: "Datajagers",
    locale: "nl_NL",
    images: ["/uploads/hero-character-sitting-on-top-of-clouds-692f40c3.jpg"],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nl" className={`${jakarta.variable} ${fragment.variable}`}>
      <body>
        <a className="dj-skip" href="#hoofdinhoud">
          Naar hoofdinhoud
        </a>
        {children}
      </body>
    </html>
  );
}
