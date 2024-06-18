import Link from "next/link";
import styles from "./Topbar.module.css";

export function Topbar() {
  return (
    <div className={styles.topbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img
          className={styles.image}
            src="/icon.svg"
            alt="Easy Share Logo"
          />
          <span className={styles.title}>DropIT</span>
        </div>
        <div className={styles.menu}>
          <Link className={styles.link} href="product">How It Works</Link>
          <Link className={styles.link} href="product">Contact</Link>
          <Link className={styles.link} href="product">FAQ</Link>
        </div>
      </div>
    </div>
  );
}
