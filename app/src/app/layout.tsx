import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "../components/ui/Notification/Notification";
import { AuthProvider } from "../components/Auth/AuthProvider/AuthProvider";
import Sidebar from "../components/Sidebar/Sidebar";
import LayoutWrapper from "../components/LayoutWrapper/LayoutWrapper";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import ServiceWorkerRegister from "../components/ServiceWorkerRegister/ServiceWorkerRegister";
import AcceptCookies from "../components/AcceptCookies/AcceptCookies";
import InstallPWA from "../components/InstallPWA/InstallPWA";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TheArenaX",
  description:
    "Join the ultimate competitive gaming platform. Compete in tournaments, win prizes, and become a champion.",
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://thearenax.upayan.dev"
  ),
  openGraph: {
    images: [
      {
        url: "/icons/icon-512x512.webp",
        width: 512,
        height: 512,
        alt: "App Icon",
      },
    ],
  },
  twitter: {
    images: [
      {
        url: "/icons/icon-512x512.webp",
        width: 512,
        height: 512,
        alt: "App Icon",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NotificationProvider>
          <AuthProvider>
            <Sidebar />
            <LayoutWrapper>
              <Header />
              <div id="title-bar">
                <span>The ArenaX</span>
              </div>
              <div id="main-content">{children}</div>
              <InstallPWA />
              <Footer />
              <ServiceWorkerRegister />
            </LayoutWrapper>
            <AcceptCookies />
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
