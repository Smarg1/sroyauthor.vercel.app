"use client";

import React from "react";
import styles from "./Button.module.css";
import Link from "next/link";

interface ButtonProps {
  label?: string;
  onClick?: () => void;
  href?: string;
  ariaLabel?: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  label = "Button",
  onClick,
  href,
  ariaLabel = "button",
  className = "",
}) => {
  if (href) {
    return (
      <Link
        href={href}
        className={`${styles.button} ${className}`}
        aria-label={ariaLabel || label}
        prefetch
      >
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={`${styles.button} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel || label}
    >
      {label}
    </button>
  );
};

export default Button;
