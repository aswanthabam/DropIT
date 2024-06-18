import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Topbar } from "@/components/Topbar";
import MainContainer from "./main";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DropIT",
  description: "Share files easily.",
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
