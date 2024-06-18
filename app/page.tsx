"use client";
import { useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
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
    mainDragEnd();
    if (event.dataTransfer.files) {
      alert(`File dropped ${event.dataTransfer.files[0].name}`);
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

  useEffect(() => {
    document.body.style.setProperty("--x", `50%`);
    document.body.style.setProperty("--y", `50%`);
  }, []);

  return (
    <main
      id="main"
      onDragOver={mainDragOver}
      onDragLeave={(e: React.DragEvent) => {
        if (!document.querySelector("#main")?.contains(e.relatedTarget as Node))
          mainDragEnd();
      }}
      onDrop={mainDrop}
      onMouseMove={mainMouseMove}
      className={styles.main}
    >
      <div className={styles.content}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Instant File Sharing</h1>
          <p className={styles.description}>
            DropIT lets you share files quickly and securely with a code or
            link. No sign-ups, no hassle—just drop it, share the code, receive.
            Experience effortless file sharing today!
          </p>
          <div className={styles.buttonContainer}>
            <button className={styles.button}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className={styles.icon}
                viewBox="0 0 16 16"
              >
                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
              </svg>
              Send a File
            </button>
            <button className={styles.button}>Receive</button>
          </div>
        </div>
      </div>
      <div id="bg" className={styles.bg}></div>
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
  );
}
