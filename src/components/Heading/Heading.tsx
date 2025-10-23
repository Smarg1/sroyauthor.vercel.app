import React from "react";
import styles from "./Heading.module.css";

interface HeadingProps {
  text: string;
}

const Heading: React.FC<HeadingProps> = ({ text }) => {
  return (
    <h2 className={styles.heading}>{text}</h2>
  );
};

export default Heading;
