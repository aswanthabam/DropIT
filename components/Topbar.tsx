"use client";
import Link from "next/link";
import styles from "./Topbar.module.css";
import icon from "../public/icon.svg";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
export function Topbar() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [locChange, setLocChange] = useState(false);
  useEffect(() => {
    if (menuOpen) {
      menuRef.current?.classList.remove(styles.open);
      setMenuOpen(false);
    }
  }, [pathname, locChange]);

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
          <Link
            onClick={() => {
              setLocChange(!locChange);
            }}
            className={styles.link}
            href="/#how-it-works"
          >
            How It Works
          </Link>
          <a
            onClick={() => {
              setLocChange(!locChange);
            }}
            className={styles.link}
            href="https://aswanthvc-dev.web.app/contact"
            target="_blank"
          >
            Get in Touch
          </a>
          <a
            onClick={() => {
              setLocChange(!locChange);
            }}
            className={styles.link}
            href="https://github.com/aswanthabam/dropit"
            target="_blank"
          >
            Github
          </a>
          <a
            href="https://www.producthunt.com/posts/dropit-0f956d64-4e7a-44ad-8f9b-6dc143b16a0c?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-dropit&#0045;0f956d64&#0045;4e7a&#0045;44ad&#0045;8f9b&#0045;6dc143b16a0c"
            target="_blank"
            className={styles.phBadge}
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=469819&theme=light"
              alt="DropIT - Instant&#0032;File&#0032;Sharing&#0032;Platform | Product Hunt"
              className={styles.phBadgeImg}
            />
          </a>
        </div>
      </div>
    </div>
  );
}
