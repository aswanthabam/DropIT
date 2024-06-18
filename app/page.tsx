"use client";
import { useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const mainMouseMove = (event: React.MouseEvent) => {
    document.body.style.setProperty("--x", `${event.clientX}px`);
    document.body.style.setProperty("--y", `${event.clientY}px`);
  };

  useEffect(() => {
    document.body.style.setProperty("--x", `${0}px`);
    document.body.style.setProperty("--y", `${0}px`);
  }, []);

  return (
    <main id="main" onMouseMove={mainMouseMove} className={styles.main}>
      <div className={styles.content}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Instant File Sharing</h1>
          <p className={styles.description}>
            Share files easily with Easy Share
          </p>
          <div className={styles.buttonContainer}>

            <button className={styles.button}>
              Send
            </button>
            <button className={styles.button}>
              Receive
            </button>
          </div>
        </div>
      </div>
      <div id="bg" className={styles.bg}></div>
    </main>
  );
}
