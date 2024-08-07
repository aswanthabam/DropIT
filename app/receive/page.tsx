"use client";
import { useContext, useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { LoaderContext } from "@/context/LoaderContext";
import Link from "next/link";
import { PopupContext, showPopup } from "@/context/PopupContext";
import { useSearchParams, useRouter } from "next/navigation";

type ProgressType = {
  buffering: boolean;
  percent: number;
  total: number;
  loaded: number;
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 KB";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)}`;
};

const progressBytes = (progress: ProgressType) => {
  const sizes = ["KB", "MB"];
  if (progress.total <= 1024) {
    return `${progress.loaded} / ${progress.total} B`;
  }
  const i = Math.floor(Math.log(progress.total) / Math.log(1024));
  return `${formatBytes(progress.loaded)} / ${formatBytes(progress.total)} ${
    i == 1 || i == 2 ? sizes[i - 1] : sizes[0]
  }`;
};

export default function Receive() {
  const { setPopup } = useContext(PopupContext);
  const [fileIcon, setFileIcon] = useState("bi bi-filetype-");
  const [fileSize, setFileSize] = useState("0MB");
  const [code, setCode] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { setLoader } = useContext(LoaderContext);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [downloading, setDownloading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressType>({
    buffering: false,
    percent: 0,
    total: 0,
    loaded: 0,
  });
  type FileInfo = {
    name: string;
    type: string;
    size: number;
    uploadedBy: string | null;
    fileUrl: string;
  };
  useEffect(() => {
    console.log("Page loaded (RECEIVE)");
    inputRef.current?.focus();
    if (searchParams.has("code")) {
      if (
        searchParams.get("code")!.length != 7 ||
        !/^[A-Z]\d{0,6}$/.test(searchParams.get("code")!)
      ) {
        showPopup(setPopup!, "Invalid Code", "bi bi-exclamation-triangle");
        router.push("/");
        return;
      }
      setCode(searchParams.get("code")!);
      for (var i = 0; i < 7; i++) {
        document
          .getElementsByClassName(styles.codeChar)
          [i != 0 ? i + 1 : i].classList.remove(styles.inactive);
      }
      viewFileInfo();
    }
    setLoader!({ text: "", visible: false });
  }, [setLoader]);

  useEffect(() => {
    if (fileInfo == null) {
      setFileIcon("bi bi-filetype-");
      setFileSize("0MB");
    } else {
      if (fileInfo.type.includes("image")) {
        setFileIcon("bi bi-file-earmark-image");
      } else if (fileInfo.type.includes("audio")) {
        setFileIcon("bi bi-file-earmark-music");
      } else if (fileInfo.type.includes("video")) {
        setFileIcon("bi bi-file-earmark-play");
      } else if (fileInfo.type.includes("pdf")) {
        setFileIcon("bi bi-file-earmark-pdf");
      } else if (fileInfo.type.includes("zip")) {
        setFileIcon("bi bi-file-earmark-zip");
      } else if (fileInfo.type.includes("text")) {
        setFileIcon("bi bi-file-earmark-text");
      } else {
        setFileIcon("bi bi-file-earmark-fill");
      }
      setFileSize((fileInfo.size / 1024 / 1024).toFixed(2) + "MB");
    }
  }, [fileInfo]);
  useEffect(() => {
    if (code.length == 7) {
      viewFileInfo();
    }
  }, [code]);
  const onCodeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value[1] == "-") {
      event.target.value =
        event.target.value.slice(0, 1) + event.target.value.slice(2);
    }
    if (event.target.value.length > 7) {
      event.target.value = code;
    }
    if (event.target.value.length == 1) {
      if (/^[a-z]$/.test(event.target.value[0])) {
        event.target.value = event.target.value.toUpperCase();
      } else if (/^[0-9]$/.test(event.target.value[0])) {
        event.target.value = "A" + event.target.value[0];
      } else if (!/^[A-Z]$/.test(event.target.value[0])) {
        event.target.value = "";
      }
    } else if (event.target.value.length > 1) {
      if (!/^\d{1,6}$/.test(event.target.value.slice(1, 7))) {
        event.target.value = code;
      }
    }
    if (
      event.target.value.length > code.length + 1 &&
      !/^[A-Z]\d{0,6}$/.test(event.target.value)
    ) {
      event.target.value = "";
    }
    setCode(event.target.value);
    for (var i = 0; i < 7; i++) {
      if (i < event.target.value.length) {
        document
          .getElementsByClassName(styles.codeChar)
          [i != 0 ? i + 1 : i].classList.remove(styles.inactive);
      } else {
        document
          .getElementsByClassName(styles.codeChar)
          [i != 0 ? i + 1 : i].classList.add(styles.inactive);
      }
    }
  };
  const viewFileInfo = async () => {
    if (code.length != 7) {
      return;
    }
    setLoader!({ text: "Fetching File Info", visible: true });
    var formattedCode = code.toUpperCase();
    var formattedCode = code[0] + "-" + code.slice(1, 7);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/file/info`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ code: formattedCode }),
        }
      );
      const data = await response.json();
      if (data.status != "success") {
        setLoader!({ text: data.message, visible: false });
        showPopup(setPopup!, data.message, "bi bi-exclamation-triangle");
      } else {
        setFileInfo({
          name: data.data.file_name,
          type: data.data.content_type,
          size: data.data.file_size,
          uploadedBy: data.data.uploaded_by,
          fileUrl: data.data.file_url,
        });
        setLoader!({ text: "", visible: false });
        showPopup(setPopup!, "File Found", "bi bi-check2");
      }
    } catch (e) {
      setLoader!({ text: "An error occured", visible: false });
      showPopup(setPopup!, "An error occured", "bi bi-exclamation-triangle");
    }
  };

  const downloadFile = () => {
    if (downloading) {
      return;
    }
    if (fileInfo == null) {
      return;
    }
    var url = `${process.env.NEXT_PUBLIC_DOWNLOAD_URL}${fileInfo.fileUrl}`;
    setDownloading(true);
    setProgress({ buffering: true, percent: 0, total: 0, loaded: 0 });
    setCode("");
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          return Promise.reject("Download Failed");
        }
        const contentLength = response.headers.get("X-File-Size");
        if (!contentLength) {
          return Promise.reject("Download Failed!1");
        }
        const total = parseInt(contentLength, 10);
        let loaded = 0;
        showPopup(setPopup!, "Downloading ...", "bi bi-download", 1000);
        const reader = response.body!.getReader();
        const stream = new ReadableStream({
          start(controller) {
            function push() {
              reader.read().then(({ done, value }) => {
                if (done) {
                  setProgress({
                    buffering: true,
                    percent: 100,
                    total,
                    loaded,
                  });
                  controller.close();
                  return;
                }
                loaded += value.length;
                setProgress({
                  buffering: false,
                  percent: (loaded / total) * 100,
                  total,
                  loaded,
                });
                controller.enqueue(value);
                push();
              });
            }
            push();
          },
        });
        console.log("Stream:", stream);
        return new Response(stream);
      })
      .then((response) => response.blob())
      .then((blob) => {
        setProgress({ ...progress, buffering: true });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = fileInfo.name; // Replace with your file name and extension
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        showPopup(setPopup!, "Downloaded", "bi bi-check2");
        setFileInfo(null);
        setFileSize("0MB");
        setFileIcon("bi bi-filetype-");
        setCode("");
        setDownloading(false);
      })
      .catch((error) => {
        console.error("Download failed:", error);
        showPopup(setPopup!, "Download failed", "bi bi-exclamation-triangle");
        setDownloading(false);
      });
  };
  return (
    <div className={styles.receive}>
      <div className={styles.content}>
        <div className={styles.grid}>
          <div className={styles.codeContainer}>
            <div className={styles.codeInfo}>
              <h1 className={styles.titleUnderlined}>Enter Your Code</h1>
              <h1
                onClick={() => {
                  inputRef.current?.focus();
                  console.log("clicked", inputRef.current);
                }}
                className={styles.code}
              >
                <span className={styles.codeChar + " " + styles.inactive}>
                  {code[0] ? code[0] : "A"}
                </span>
                <span className={styles.codeChar + " " + styles.divider}>
                  -
                </span>
                <span className={styles.codeChar + " " + styles.inactive}>
                  {code[1] ? code[1] : "●"}
                </span>
                <span className={styles.codeChar + " " + styles.inactive}>
                  {code[2] ? code[2] : "●"}
                </span>
                <span className={styles.codeChar + " " + styles.inactive}>
                  {code[3] ? code[3] : "●"}
                </span>
                <span className={styles.codeChar + " " + styles.inactive}>
                  {code[4] ? code[4] : "●"}
                </span>
                <span className={styles.codeChar + " " + styles.inactive}>
                  {code[5] ? code[5] : "●"}
                </span>
                <span className={styles.codeChar + " " + styles.inactive}>
                  {code[6] ? code[6] : "●"}
                </span>
              </h1>
              <input
                ref={inputRef}
                onChange={onCodeInput}
                type="text"
                placeholder=""
                style={{
                  opacity: 0,
                  position: "fixed",
                  top: "-100px",
                  zIndex: -10,
                }}
              />
              <p className={styles.info}>
                Enter the code for downloading the file. Dont know how to get
                the code?{" "}
                <Link href={"/#how-it-works"}>
                  Click here to know how it works
                </Link>
              </p>
            </div>
          </div>
          <div className={styles.file}>
            {fileInfo == null ? (
              <>
                <i
                  className={`bi bi-file-earmark-fill ${styles.previewIcon}`}
                ></i>
                <h4 className={styles.previewText}>
                  Your File will appear here
                </h4>
              </>
            ) : (
              <>
                <i className={styles.icon + " " + fileIcon}></i>
                <h2 className={styles.fileName}>{fileInfo.name}</h2>
                <span className={styles.type}>{fileInfo.type}</span>
                <p className={styles.size}>{fileSize}</p>
                <span className={styles.uploadedBy}>
                  Uploaded by{" "}
                  <span className={styles.name}>
                    {fileInfo.uploadedBy ?? "Anonymous User"}
                  </span>
                </span>
                {downloading && (
                  <div className={styles.progressContainer}>
                    <progress
                      className={styles.progress}
                      value={progress.buffering ? undefined : progress.loaded}
                      max={progress.total}
                    ></progress>
                    <span className={styles.progressText}>
                      {progressBytes(progress)}
                    </span>
                  </div>
                )}
                <div className={styles.buttonContainer}>
                  <button
                    onClick={downloadFile}
                    className={
                      styles.button + (downloading ? " " + styles.inactive : "")
                    }
                  >
                    Download It
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className={styles.icon}
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
