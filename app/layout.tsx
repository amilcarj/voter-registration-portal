import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/utils/tw-merge";

const stellar = localFont({
  src: [
    {
      path: "./fonts/Stellar-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Stellar-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Stellar-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Stellar-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-stellar",
  display: "swap",
});

const greekCaps = localFont({
  src: [
    {
      path: "./fonts/GreekCaps.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-greek-caps",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Voter Registration Portal",
  description:
    "A voter registration portal hosted by La Unidad Latina, in partnership with Voto Latino",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
