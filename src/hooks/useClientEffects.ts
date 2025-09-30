"use client";

import { useEffect } from "react";

export function useClientEffects() {
  useEffect(() => {
    console.log("%cStop!", "color: red; font-size: 40px; font-weight: bold;");
    console.log(
      "%cThis browser feature is intended for developers. If someone told you to copy and paste something here, it could be a scam and give them access to your accounts or device.",
      "font-size: 16px; max-width: 600px;"
    );
    console.log(
      "%cUnless you know exactly what you're doing, close this window and stay safe.",
      "font-size: 14px;"
    );

    const appearObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    const fadeElements = document.querySelectorAll<HTMLElement>(".fade-in");
    fadeElements.forEach(el => appearObserver.observe(el));
  }, []);
}
