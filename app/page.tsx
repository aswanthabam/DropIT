'use client'
import styles from "./page.module.css";

export default function Home() {
  const mainMouseMove = (event: React.MouseEvent) => {
    document.body.style.setProperty("--x", `${event.clientX}px`);
    document.body.style.setProperty("--y", `${event.clientY}px`);
  }

  return (
    <main id="main" onMouseMove={mainMouseMove} className={styles.main}>
      <div className={styles.content}>
        <h1 className={styles.title}>Easy Share</h1>
        <p className={styles.description}>Share files easily with Easy Share</p>
      </div>
      <div id="bg" className={styles.bg}></div>
    </main>
  );
}
