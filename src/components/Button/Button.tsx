import React from "react";
import Link from "next/link";
import styles from "./Button.module.css";

interface ButtonProps {
  label?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  href?: string;
  internal?: boolean;
  ariaLabel?: string;
}

const Button: React.FC<ButtonProps> = ({
  label = "Button",
  onClick,
  href,
  internal = false,
  ariaLabel,
}) => {
  if (href && internal) {
    return (
      <Link href={href} className={styles.button} aria-label={ariaLabel || label}>
        {label}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.button}
        aria-label={ariaLabel || label}
      >
        {label}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      aria-label={ariaLabel || label}
    >
      {label}
    </button>
  );
};

export default Button;
