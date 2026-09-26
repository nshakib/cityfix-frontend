import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/providers";
import { Toaster } from "@/components/ui/sonner";

const outfitHeading = Outfit({subsets:['latin'],variable:'--font-heading'});

const dmSans = DM_Sans({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CityFix",
  description: "CityFix - City Complaint & Service Management Platform",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", dmSans.variable, outfitHeading.variable)}
    >
      <Providers>
        <body className="min-h-full flex flex-col">
          {children}
          <Toaster />          
        </body>
      </Providers>
    </html>
  );
}
