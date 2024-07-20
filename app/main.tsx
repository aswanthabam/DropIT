"use client";
import { FileProvider } from "@/context/FileContext";
import "./globals.css";
import styles from "./main.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import bgIllustration from "../public/bg-illustration.svg";
import Image from "next/image";
import { LoaderContextType, LoaderProvider } from "@/context/LoaderContext";
import {
  PopupContextType,
  PopupProvider,
  showPopup,
} from "@/context/PopupContext";
import TermsPopup from "@/components/TermsPopup";

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
  const [popup, setPopup] = useState<PopupContextType | null>({
    text: "",
    visible: false,
    icon: "bi bi-info",
  });
  const [statusLoaded, setStatusLoaded] = useState(false);
  var captureVisit = false;
  useEffect(() => {
    if (captureVisit) return;
    captureVisit = true;
    fetch(
      `${process.env.NEXT_PUBLIC_PRODUCT_ANALYZER_URL}/api/product/dropit/visit`
    )
      .then(async () => {
        console.log("CAPTURED!:)");
      })
      .catch(() => {
        console.log("FAILED CAPTUR!:(");
      });
  }, []);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key == "Escape") {
        router.push("/");
      } else if (
        !window.location.pathname.includes("receive") &&
        !window.location.pathname.includes("share")
      ) {
        if (event.key == "r") router.push("/receive");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    console.log("Page loaded (MAIN)", process.env.NODE_ENV);
    const handlePaste = (event: React.ClipboardEvent) => {
      if (window.location.pathname.includes("receive")) return;
      event.clipboardData?.items[0].getAsString((text) => {
        navigator.clipboard.readText().then((text) => {
          console.log(text);
          if (text[1] == "-") text = text[0] + text.slice(2);
          if (text.length > 8 || !/^[A-Z]\d{0,6}$/.test(text)) return;
          router.push(`/receive/?code=${text}`);
        });
      });
    };
    window.addEventListener("paste", handlePaste as any);
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
    if (!statusLoaded) {
      if (window.location.pathname.includes("/terms-and-conditions")) {
        setLoader({ text: "", visible: false });
        return;
      }
      setLoader!({ text: "Awaking Server", visible: true });
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/server/status`)
        .then(async (res) => {
          setStatusLoaded(true);
          if (res.status != 200) {
            router.push("/offline");
            setLoader!({ text: "", visible: false });
          } else {
            var data = await res.json();
            console.log(data);
            if (data.status != "success" || data.data.status == false) {
              setLoader!({ text: "", visible: false });
              router.push("/offline");
            } else {
              if (window.location.pathname.includes("offline")) {
                router.push("/");
              }
              setLoader!({ text: "", visible: false });
            }
          }
        })
        .catch(() => {
          setStatusLoaded(true);
          router.push("/offline");
          setLoader!({ text: "", visible: false });
        });
    }
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
      if (event.dataTransfer.files[0].size > 30 * 1024 * 1024) {
        setLoader!({ text: "", visible: false });
        showPopup(
          setPopup!,
          "File size is too large (Maximum 30 MB)",
          "bi bi-x-circle",
          2000
        );
        return;
      }
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
        <PopupProvider popup={popup} setPopup={setPopup}>
          <TermsPopup />
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
              className={
                styles.popup + " " + (popup?.visible ? styles.active : "")
              }
            >
              <i className={`${popup?.icon} ${styles.icon}`}></i>
              <h2 className={styles.message}>{popup?.text}</h2>
            </div>
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
        </PopupProvider>
      </FileProvider>
    </LoaderProvider>
  );
}
