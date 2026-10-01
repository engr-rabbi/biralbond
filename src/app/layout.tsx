import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, GOOGLE_SITE_VERIFICATION } from "@/lib/site";
import { OG_IMAGE } from "@/lib/seo";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { ApiBridge } from "@/components/api-bridge";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  alternates: { canonical: `${SITE_URL}/` },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  ...(GOOGLE_SITE_VERIFICATION ? { verification: { google: GOOGLE_SITE_VERIFICATION } } : {}),
  icons: { icon: `${SITE_URL}/logo.svg` },
  title: "BiralBond — বাংলাদেশের প্রিমিয়াম বিড়ালপ্রেমী প্ল্যাটফর্ম",
  description:
    "BiralBond is Bangladesh's premium community for cat lovers — adopt cats, shop premium supplies, find trusted vets, read expert care guides, and connect with fellow cat parents across Dhaka, Chattogram, Sylhet & beyond.",
  keywords: [
    "cat lovers Bangladesh",
    "cat adoption Dhaka",
    "cat food Bangladesh",
    "veterinarian Dhaka",
    "BiralBond",
    "বিড়াল",
    "cat community Bangladesh",
    "Persian cat Bangladesh",
  ],
  authors: [{ name: "BiralBond Team" }],
  openGraph: {
    title: "BiralBond — Bangladesh's Premium Cat Lovers Platform",
    description:
      "Adopt, shop, learn and connect — the warmest home for Bangladesh's cat lovers.",
    siteName: "BiralBond",
    type: "website",
    url: `${SITE_URL}/`,
    locale: "bn_BD",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "BiralBond — Premium Cat Lovers Platform",
    description: "Bangladesh's warmest home for cat parents.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: SITE_NAME, inLanguage: ["bn", "en"] },
                { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: SITE_NAME, url: `${SITE_URL}/`, logo: `${SITE_URL}/logo.svg` },
              ],
            }),
          }}
        />
        <ApiBridge />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
            <Toaster />
            <SonnerToaster position="top-center" richColors />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
