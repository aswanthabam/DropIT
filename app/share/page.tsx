"use client";
import { useContext, useEffect, useState } from "react";
import styles from "./page.module.css";
import MainContainer from "../main";
import { FileContext } from "@/context/FileContext";
import { useRouter } from "next/navigation";
import { LoaderContext, LoaderContextType } from "@/context/LoaderContext";
import { PopupContext, showPopup } from "@/context/PopupContext";
import { off } from "process";

export default function Share() {
  const { file, setFile } = useContext(FileContext);
  const [fileIcon, setFileIcon] = useState("bi bi-filetype-");
  const [fileSize, setFileSize] = useState("0MB");
  const [usageCount, setUsageCount] = useState(1);
  const [name, setName] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { setLoader } = useContext(LoaderContext);
  const router = useRouter();
  const { setPopup } = useContext(PopupContext);
  useEffect(() => {
    console.log("Page loaded (SHARE)");
    setCode(null);
    setCopied(false);
    setUsageCount(1);
    setLoader!({ text: "", visible: false });
    if (!file) {
      router.push("/");
    }
    var ty = file?.type?.split("/")[1];
    if (ty?.includes("+")) {
      ty = ty.split("+")[0];
    } else if (ty == "x-zip-compressed") ty = "bi bi-file-zip";
    if (ty == "jpeg") ty = "jpg";
    setFileIcon(`bi bi-filetype-${ty}`);
    setFileSize(`${((file?.size || 0) / 1000000).toFixed(2)} MB`);
  }, [file]);

  const clearFile = () => {
    setCode(null);
    setCopied(false);
    setFile!(null);
    setName("");
    setUsageCount(1);
    setFileSize("0MB");
    setFileIcon("bi bi-filetype-");
    router.push("/");
  };
  const uploadFile = async () => {
    if (!file) return;
    var fileSize = file.size;
    var createUrl = `${process.env.NEXT_PUBLIC_API_URL}/file/create`;
    var buffers = [];
    var fileId = null;
    try {
      const createResponse = await fetch(createUrl, {
        method: "POST",
        body: new URLSearchParams({
          file_name: file.name,
          file_size: fileSize.toString(),
          uploaded_by: name,
          content_type: file.type,
          usage_limit: usageCount.toString(),
        }),
      });
      if (createResponse.status != 200) {
        showPopup(setPopup!, "Failed to upload file", "bi bi-x-circle", 3000);
        return;
      }
      const createData = await createResponse.json();
      if (createData.status == "success") {
        setCode(createData.data.code);
        fileId = createData.data.file_id;
        buffers = createData.data.buffers;
      } else {
        showPopup(setPopup!, createData.message, "bi bi-x-circle", 3000);
        return;
      }
    } catch (e) {
      console.error(e);
      showPopup(setPopup!, "Failed to upload file", "bi bi-x-circle", 3000);
      return;
    }
    var uploadUrl = `${process.env.NEXT_PUBLIC_API_URL}/file/upload`;
    var offset = 0;
    for (var i = 0; i < buffers.length; i++) {
      var chunk = buffers[i];
      var bytes = await getFileBytes(offset, chunk);
      if (bytes == null) {
        showPopup(
          setPopup!,
          "Something went wrong while uploading.",
          "bi bi-check-circle",
          3000
        );
        setLoader!({ text: "", visible: false });
        clearFile();
        return;
      }
      var formData = new FormData();
      if (!fileId) {
        showPopup(setPopup!, "Failed to upload file", "bi bi-x-circle", 3000);
        clearFile();
        return;
      }
      formData.append("bufferFile", new Blob([bytes!]));
      formData.append("file_id", fileId!.toString());
      formData.append("buffer_index", i.toString());
      try {
        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });
        if (uploadResponse.status != 200) {
          showPopup(setPopup!, "Failed to upload file", "bi bi-x-circle", 3000);
          clearFile();
          return;
        }
        const uploadData = await uploadResponse.json();
        if (uploadData.status != "success") {
          showPopup(setPopup!, uploadData.message, "bi bi-x-circle", 3000);
          clearFile();
          return;
        }
        if (uploadData.data.file_id != fileId) {
          showPopup(setPopup!, "Failed to upload file", "bi bi-x-circle", 3000);
          clearFile();
          return;
        }
        if (uploadData.data.next_buffer != i + 1) {
          showPopup(setPopup!, "Failed to upload file", "bi bi-x-circle", 3000);
          clearFile();
          return;
        }
        offset += chunk;
      } catch (e) {
        console.error(e);
        showPopup(setPopup!, "Failed to upload file", "bi bi-x-circle", 3000);
        clearFile();
        return;
      }
    }
  };

  const getFileBytes: (
    offset: number,
    chunkSize: number
  ) => Promise<Uint8Array | null> = (offset: number, chunkSize: number) => {
    return new Promise<Uint8Array | null>((resolve, reject) => {
      if (!file) {
        reject("No file selected.");
        return;
      }
      if (offset >= file.size) {
        resolve(null);
        return;
      }
      const chunk = file.slice(offset, offset + chunkSize);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target!.result;
        const bytes = new Uint8Array(result as ArrayBuffer);
        resolve(bytes);
      };
      reader.onerror = (error) => {
        reject("Error reading file: " + error);
      };
      reader.readAsArrayBuffer(chunk);
    });
  };

  return (
    <div className={styles.share}>
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
                <button
                  onClick={() => {
                    setLoader!({ text: "Uploading ...", visible: true });
                    uploadFile().then(() => {
                      setLoader!({ text: "", visible: false });
                    });
                  }}
                  className={styles.button}
                >
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
