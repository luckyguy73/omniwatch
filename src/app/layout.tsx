import { AuthProvider } from "@/lib/auth/AuthContext";
import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import React from "react";
import "./globals.css";

// Use Inter (popular sans-serif) and set generic CSS variable names for clarity
const interSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OmniWatch",
  description: "Movies and TV tracker",
  icons: {
    icon: [
      { url: '/favicon.svg?v=2', type: 'image/svg+xml' },
      { url: '/icon-192.svg?v=2', sizes: '192x192', type: 'image/svg+xml' },
      { url: '/icon-512.svg?v=2', sizes: '512x512', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon-192.svg?v=2', sizes: '192x192', type: 'image/svg+xml' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
        color: '#151e2e'
      }
    ]
  },
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
} as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
