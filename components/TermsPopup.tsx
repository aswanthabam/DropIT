import { useEffect, useState } from "react";
import styles from "./TermsPopup.module.css";

export default function TermsPopup() {
  useEffect(() => {
    if (localStorage.getItem("termsAccepted") == "1") {
      setAccepted(true);
    }
  }, []);
  const [accepted, setAccepted] = useState(false);
  const acceptTerms = () => {
    localStorage.setItem("termsAccepted", "1");
    setAccepted(true);
  };
  return (
    <div className={styles.popup + " " + (accepted ? styles.hidden : "")}>
      <p className={styles.content}>
        Welcome to DropIT! By continuing to use our service, you agree to our{" "}
        <a className={styles.link} href="/terms-and-conditions" target="_blank">
          Terms and Conditions
        </a>
        .
      </p>
      <button onClick={acceptTerms} className={styles.closeButton}>
        Understood
      </button>
    </div>
  );
}
