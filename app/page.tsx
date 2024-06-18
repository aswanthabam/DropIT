"use client";
import { useEffect } from "react";
import styles from "./page.module.css";
import { Main } from "next/document";
import MainContainer from "./main";

export default function Home() {
  useEffect(() => {
    console.log("Page loaded(HOME)");
  }, []);

  return (
    <MainContainer>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>Instant File Sharing</h1>
        <p className={styles.description}>
          DropIT lets you share files quickly and securely with a code or link.
          No sign-ups, no hassle—just drop it, share the code, receive.
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
    </MainContainer>
  );
}
