import type { Metadata } from "next";
import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ToasterProvider from "@/components/providers/ToasterProvider";
import { ThemeProvider } from "@/lib/theme-provider";

export const metadata: Metadata = {
  title: "Wick & Lather | Luxury Handcrafted Soaps & Candles from Thailand",
  description:
    "Premium handcrafted soaps and luxury scented candles made in Thailand. Export-quality wellness products crafted with natural ingredients, Thai heritage, and artisanal excellence. International shipping available.",
  keywords:
    "handcrafted soaps Thailand, luxury candles Thailand, Thai artisan soap, premium candles Thailand, natural skincare Thailand, export quality soap, luxury wellness products, Thai handcrafted goods, international shipping",
  openGraph: {
    title: "Wick & Lather | Luxury Handcrafted Soaps & Candles from Thailand",
    description:
      "Premium handcrafted soaps and luxury scented candles made in Thailand. Export-quality products for global customers.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Wick & Lather",
              url:
                process.env.NEXT_PUBLIC_APP_URL ||
                "https://wickandlather.com",
              logo: `${
                process.env.NEXT_PUBLIC_APP_URL ||
                "https://wickandlather.com"
              }/logo.png`,
              description:
                "Luxury handcrafted soaps and premium scented candles made in Thailand. Export-quality products crafted with natural ingredients and Thai artisan heritage.",
              address: {
                "@type": "PostalAddress",
                addressCountry: "TH",
              },
              sameAs: [
                "https://www.instagram.com/wickandlather",
                "https://www.facebook.com/wickandlather",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-555-0123",
                contactType: "customer service",
                email: "hello@wickandlather.com",
              },
            }),
          }}
        />
      </head>

      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <ToasterProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}