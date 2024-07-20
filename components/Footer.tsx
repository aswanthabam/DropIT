import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={`${styles.text} rainbow-text`}>
        Made with ♡ by{" "}
        <a
          className={styles.link}
          href="https://aswanthvc.me/?ref=dropit"
          target="_blank"
          rel="noopener noreferrer"
        >
          Aswanth V C
        </a>
      </p>
      <div className={styles.links}>
        <a href="/terms-and-conditions" className={styles.link}>
          Terms and Conditions
        </a>
      </div>
    </footer>
  );
}
