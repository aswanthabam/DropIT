"use client";
import { FileContext, FileProvider } from "@/context/FileContext";
import "./globals.css";
import styles from "./main.module.css";
import { useRouter } from "next/navigation";
import { use, useContext, useEffect, useState } from "react";
import bgIllustration from "../public/bg-illustration.svg";
import Image from "next/image";
import {
  LoaderContext,
  LoaderContextType,
  LoaderProvider,
} from "@/context/LoaderContext";

export default function MainContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [loader, setLoader] = useState<LoaderContextType | null>({
    text: "",
    visible: true,
  });
  useEffect(() => {
    setLoader!({ text: "", visible: false });
    document.body.style.setProperty("--x", "0px");
    document.body.style.setProperty("--y", "0px");
    document.body.style.setProperty(
      "--cursor-colors",
      `radial-gradient(
        ellipse at var(--x) var(--y),
        rgba(142, 247, 182, 1) 0%,
        rgba(175, 224, 228, 1)
      )`
    );
  }, []);
  const [file, setFile] = useState<File | null>(null);
  const mainMouseMove = (event: React.MouseEvent) => {
    document.body.style.setProperty("--x", `${event.clientX}px`);
    document.body.style.setProperty("--y", `${event.clientY}px`);
    document.body.style.setProperty(
      "--cursor-colors",
      `radial-gradient(
        ellipse at var(--x) var(--y),
        rgba(142, 247, 182, 1) 0%,
        rgba(175, 224, 228, 1)
      )`
    );
  };

  const mainDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    document.body.style.setProperty(
      "--cursor-colors",
      `radial-gradient(
      ellipse at var(--x) var(--y),
      #29845E 0%,
      rgba(175, 224, 228, 1)
    )`
    );
    document.querySelector("#bg")?.classList.add(styles.active);
    document.querySelector("#dropZone")?.classList.add(styles.active);
  };

  const mainDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setLoader!({ text: "Loading...", visible: true });
    mainDragEnd();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setFile!(event.dataTransfer.files[0]);
      router.push("/share/");
      setLoader!({ text: "", visible: false });
    }
  };

  const mainDragEnd = () => {
    document.body.style.setProperty(
      "--cursor-colors",
      `radial-gradient(
        ellipse at var(--x) var(--y),
        rgba(142, 247, 182, 1) 0%,
        rgba(175, 224, 228, 1)
      )`
    );
    document.querySelector("#bg")?.classList.remove(styles.active);
    document.querySelector("#dropZone")?.classList.remove(styles.active);
  };

  return (
    <LoaderProvider loader={loader} setLoader={setLoader}>
      <FileProvider file={file} setFile={setFile}>
        <main
          id="main"
          onDragOver={mainDragOver}
          onDragLeave={(e: React.DragEvent) => {
            if (
              !document
                .querySelector("#main")
                ?.contains(e.relatedTarget as Node)
            )
              mainDragEnd();
          }}
          onDrop={mainDrop}
          onMouseMove={mainMouseMove}
          className={styles.main}
        >
          <div
            id="loader"
            className={
              styles.loader + " " + (loader?.visible ? styles.active : "")
            }
          >
            <svg
              width="148"
              height="297"
              viewBox="0 0 148 297"
              className={styles.svg}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M70 183.5V279.525C70 294.93 91.655 298.315 96.356 283.645L143.151 137.618C145.942 128.906 139.443 119.998 130.295 119.998H83.5C79.9101 119.998 77 117.088 77 113.498V17.9919C77 2.54976 55.2666 -0.794556 50.6245 13.9335L4.76133 159.442C2.01928 168.141 8.5154 177 17.6369 177H63.5C67.0899 177 70 179.91 70 183.5Z"
                fill="url(#paint0_linear_13_12)"
                stroke="url(#paint1_linear_13_12)"
                strokeWidth="7"
                className="svg-elem-1"
              ></path>
              <defs>
                <linearGradient
                  id="paint0_linear_13_12"
                  x1="74"
                  y1="-47"
                  x2="74"
                  y2="343.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#29845E"></stop>
                  <stop offset="1" stopColor="#66A63F"></stop>
                </linearGradient>
                <linearGradient
                  id="paint1_linear_13_12"
                  x1="4"
                  y1="79.5"
                  x2="144"
                  y2="238.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#476CEE"></stop>
                  <stop offset="1" stopColor="#293D88"></stop>
                </linearGradient>
              </defs>
            </svg>
            <h2 className={styles.title}>{loader?.text}</h2>
          </div>
          <div className={styles.content}>{children}</div>
          <div id="bg" className={styles.bg}>
            <Image
              className={styles.bgIllustration}
              src={bgIllustration}
              alt=""
            ></Image>
          </div>
          <div id="dropZone" className={styles.dropZone}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className={styles.icon}
              viewBox="0 0 16 16"
            >
              <path d="M8.5 11.5a.5.5 0 0 1-1 0V7.707L6.354 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 7.707z" />
              <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
            </svg>
            <h1>Drop File to share</h1>
          </div>
        </main>
      </FileProvider>
    </LoaderProvider>
  );
}
