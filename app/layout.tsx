import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Topbar } from "@/components/Topbar";
import MainContainer from "./main";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DropIT",
  description:
    "DropIT is a fast and simple file-sharing platform. Share files without an account using a memorable code, ensuring easy and quick transfers across the internet.",
  keywords:
    "dropit, file sharing, instant file sharing, effortless file sharing, no account needed, simple file sharing, quick file transfer, DropIT, code-based file sharing, fast file sharing, secure file sharing",
  authors: [
    {
      name: "Aswanth V C",
      url: "https://aswanthvc.me",
    },
  ],
  openGraph: {
    type: "website",
    url: "https://drop-it.web.app",
    title: "DropIT",
    description:
      "DropIT is a fast and simple file-sharing platform. Share files without an account using a memorable code, ensuring easy and quick transfers across the internet.",
    siteName: "DropIT",
    images: [
      {
        url: "/banner.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@_aswanthvc",
    creator: "@_aswanthvc",
    images: "/banner.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        ></link>
      </head>
      <body className={inter.className}>
        <Topbar />
        <MainContainer>{children}</MainContainer>
      </body>
    </html>
  );
}
