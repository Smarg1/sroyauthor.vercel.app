"use client";

import { motion, Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import React from "react";
import styles from "./PageTransition.module.css";

const variants: Variants = {
  initial: { opacity: 0, y: 50 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.5, 0, 0.2, 1] },
  },
};

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      variants={variants}
      initial="initial"
      animate="animate"
      className={styles.motion}
    >
      {children}
    </motion.div>
  );
}
