"use client";
import { useContext, useEffect, useState } from "react";
import styles from "./page.module.css";
import MainContainer from "../main";
import { FileContext } from "@/context/FileContext";
import { useRouter } from "next/navigation";

export default function Share() {
  const { file, setFile } = useContext(FileContext);
  const [fileIcon, setFileIcon] = useState("bi bi-filetype-");
  const [fileSize, setFileSize] = useState("0MB");
  const [usageCount, setUsageCount] = useState(1);
  const [name, setName] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  useEffect(() => {
    console.log("Page loaded (SHARE)");
    if (!file) {
      router.push("/");
    }
    setFileIcon(`bi bi-filetype-${file?.type?.split("/")[1]}`);
    setFileSize(`${((file?.size || 0) / 1000000).toFixed(2)} MB`);
    console.log(fileIcon);
  }, []);

  const uploadFile = async () => {
    if (!file) return;
    document.getElementById("loader")?.classList.add(styles.active);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploaded_by", name);
    formData.append("usage_limit", usageCount.toString());
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/file/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    console.log(response);
    if (response.status == 200) {
      const data = await response.json();
      console.log(data);
      if (data.status == "success") {
        setCode(data.data.code);
      }
    }
    document.getElementById("loader")?.classList.remove(styles.active);
  };

  return (
    <div className={styles.share}>
      <div id="loader" className={styles.loader}>
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
            stroke-width="7"
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
              <stop stop-color="#29845E"></stop>
              <stop offset="1" stop-color="#66A63F"></stop>
            </linearGradient>
            <linearGradient
              id="paint1_linear_13_12"
              x1="4"
              y1="79.5"
              x2="144"
              y2="238.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#476CEE"></stop>
              <stop offset="1" stop-color="#293D88"></stop>
            </linearGradient>
          </defs>
        </svg>
        <h2 className={styles.title}>Uploading ...</h2>
      </div>
      {code != null ? (
        <div className={styles.content}>
          <div className={styles.codeContainer}>
          <h1 className={styles.titleUnderlined}>Your Code</h1>
            <h2
              onClick={() => {
                navigator.clipboard.writeText(code);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
              className={styles.code}
            >
              {code}{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.copyIcon}
                viewBox="0 0 24 24"
              >
                {copied ? (
                  <>
                    <path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path>
                  </>
                ) : (
                  <>
                    <path d="M14 8H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V10c0-1.103-.897-2-2-2z"></path>
                    <path d="M20 2H10a2 2 0 0 0-2 2v2h8a2 2 0 0 1 2 2v8h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"></path>
                  </>
                )}
              </svg>
            </h2>
            <p className={styles.info}>
              Share this code with anyone to download the file. The file will be
              deleted after it has been downloaded {usageCount} times.
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.content}>
          <h1>Share File</h1>
          <div className={styles.grid}>
            <div className={styles.file}>
              <i className={styles.icon + " " + fileIcon}></i>
              <h2 className={styles.fileName}>{file?.name}</h2>
              <span className={styles.type}>{file?.type}</span>
              <p className={styles.size}>{fileSize}</p>
            </div>
            <div className={styles.form}>
              <div className={styles.container}>
                <label className={styles.label}>
                  Your Name{" "}
                  <span className={styles.info}>
                    (Enter your name here, truely optional)
                  </span>
                </label>
                <input
                  className={styles.input}
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                  type="text"
                  placeholder="Your Beautiful Name Here (optional)"
                />
                <label className={styles.label}>
                  Usage Count{" "}
                  <span className={styles.info}>
                    (How many times this files can be downloaded)
                  </span>
                </label>
                <input
                  className={styles.input + " " + styles.inputNumber}
                  type="number"
                  onChange={(event) => {
                    setUsageCount(parseInt(event.target.value));
                  }}
                  placeholder="Usage Count"
                  value={usageCount}
                />
                <p className={styles.info}>
                  After you send the file, you will get a code which can be
                  shared to anyone to download the file. The file will be
                  deleted after the code has been used usage count times.
                </p>
              </div>
              <div className={styles.buttonContainer}>
                <button onClick={uploadFile} className={styles.button}>
                  Send It
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
