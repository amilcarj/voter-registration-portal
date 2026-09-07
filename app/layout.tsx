import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import "./globals.css";
import { cn } from "@/utils/tw-merge";

const stellar = localFont({
  display: "swap",
  src: [
    {
      path: "./fonts/Stellar-Light.woff2",
      style: "normal",
      weight: "300",
    },
    {
      path: "./fonts/Stellar-Regular.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "./fonts/Stellar-Medium.woff2",
      style: "normal",
      weight: "500",
    },
    {
      path: "./fonts/Stellar-Bold.woff2",
      style: "normal",
      weight: "700",
    },
  ],
  variable: "--font-stellar",
});

const greekCaps = localFont({
  display: "swap",
  src: [
    {
      path: "./fonts/GreekCaps.woff2",
      style: "normal",
      weight: "400",
    },
  ],
  variable: "--font-greek-caps",
});

export const metadata: Metadata = {
  description:
    "A voter registration portal hosted by La Unidad Latina, in partnership with Voto Latino",
  title: "Voter Registration Portal",
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(stellar.variable, greekCaps.variable, "h-full antialiased")}
    >
      <body className="min-h-full flex flex-col items-center justify-center w-full p-4 sm:p-8">
        {children}
      </body>
    </html>
  );
}
