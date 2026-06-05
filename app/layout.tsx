import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Providers } from "@/lib/providers"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Sky Shamba | Weather for Farmers",
  description:
    "Real-time weather conditions, 7-day forecasts, and AI-powered agronomic advice built for farmers across Africa.",
  keywords: ["weather", "farming", "agriculture", "Africa", "forecast"],
  authors: [{ name: "Sky Shamba" }],
  openGraph: {
    title: "Sky Shamba | Weather for Farmers",
    description: "Real-time weather and AI agronomic insights for your farm.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#059669", // emerald-600
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
