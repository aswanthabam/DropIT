"use client";
import Link from "next/link";
import styles from "./Topbar.module.css";
import icon from "../public/icon.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
export function Topbar() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const openMenu = () => {
    menuRef.current?.classList.toggle(styles.open);
    setMenuOpen(!menuOpen);
  };
  return (
    <div className={styles.topbar}>
      <div className={styles.container}>
        <div
          className={styles.logo}
          onClick={() => {
            router.push("/");
          }}
        >
          <Image className={styles.image} src={icon} alt="Easy Share Logo" />
          <span className={styles.title}>DropIT</span>
        </div>
        <div className={styles.menuIcon} onClick={openMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className={styles.icon}
          >
            {menuOpen ? (
              <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path>
            ) : (
              <path d="M4 6h16v2H4zm4 5h12v2H8zm5 5h7v2h-7z"></path>
            )}
          </svg>
        </div>
        <div ref={menuRef} className={styles.menu}>
          <Link className={styles.link} href="product">
            How It Works
          </Link>
          <Link className={styles.link} href="product">
            Contact
          </Link>
          <Link className={styles.link} href="product">
            FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
