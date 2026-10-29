import type { Metadata } from "next";
import { Literata, Manrope } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const literata = Literata({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Flora — цветы с доставкой в ПВЗ",
    template: "%s · Flora",
  },
  description: "Свежие букеты, оплата онлайн и самовывоз из пунктов СДЭК.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${literata.variable} ${manrope.variable} antialiased`}>
        <div
          className="min-h-screen"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at top, rgba(232,164,160,0.18), transparent 45%), radial-gradient(ellipse at bottom right, rgba(47,107,79,0.12), transparent 40%)",
          }}
        >
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
