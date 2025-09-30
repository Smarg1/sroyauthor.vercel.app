import Image from "next/image";
import styles from "./Footer.module.css";
import appConfig from "@/config/app.config";

export default function Footer() {
  const socialLinks = appConfig.footer.socialLinks;

  return (
    <footer className={styles.footer} id="contact">
      <p>{appConfig.footer.copyright}</p>

      <div className={styles["social-icons"]}>
        {socialLinks.map(({ href, label, title, src, external }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            title={title}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <Image src={src} alt={label} width={18} height={18} />
          </a>
        ))}
      </div>
    </footer>
  );
}
