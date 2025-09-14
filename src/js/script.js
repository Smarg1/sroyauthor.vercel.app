// === Developer Console Warning ===
console.log("%cStop!", "color: red; font-size: 40px; font-weight: bold;");
console.log(
  "%cThis browser feature is intended for developers. If someone told you to copy and paste something here, it could be a scam and give them access to your accounts or device.",
  "font-size: 16px; max-width: 600px;"
);
console.log(
  "%cUnless you know exactly what you're doing, close this window and stay safe.",
  "font-size: 14px;"
);

// === Constants ===
const ICONS = {
  bars: "/images/icons/bars.svg",
  close: "/images/icons/close.svg",
};

// === Cached DOM References ===
let toggleBtn, menu, icon;

// === Intersection Observer (fade-in on scroll) ===
const appearObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

// === Utility: Toggle Icon ===
function toggleIcon() {
  if (!icon) return;
  icon.src = icon.src.endsWith("bars.svg") ? ICONS.close : ICONS.bars;
}

// === Initialize Fade-in ===
function initFadeIn() {
  const faders = document.querySelectorAll(".fade-in");
  const observe = () => faders.forEach(el => appearObserver.observe(el));

  if ("requestIdleCallback" in window) {
    requestIdleCallback(observe);
  } else {
    setTimeout(observe, 100);
  }
}

// === Close Menu Helper ===
function closeMenu() {
  if (menu?.classList.contains("active")) {
    menu.classList.remove("active");
    toggleBtn?.classList.add("open");
    toggleIcon();
  }
}

// === Attach Event Handlers ===
function attachHandlers() {
  // Nav links close the menu
  document.querySelectorAll(".nav-item a").forEach(link =>
    link.addEventListener("click", closeMenu)
  );

  // Toggle button
  toggleBtn?.addEventListener("click", () => {
    menu?.classList.toggle("active");
    toggleBtn.classList.toggle("open");
    toggleIcon();
  });

  // Close menu on scroll (mobile only)
  window.addEventListener("scroll", () => {
    if (window.innerWidth < 800) {
      closeMenu();
    }
  }, { passive: true });
}

// === DOM Ready Init ===
window.addEventListener("DOMContentLoaded", () => {
  toggleBtn = document.getElementById("menu-toggle");
  menu = document.querySelector(".menu-items");
  icon = toggleBtn?.querySelector("img");

  initFadeIn();

  const initDeferred = () => attachHandlers();

  if ("requestIdleCallback" in window) {
    requestIdleCallback(initDeferred, { timeout: 200 });
  } else {
    setTimeout(initDeferred, 100);
  }
});


// Analytics - (pls fix, add inject() [method to button click and interaction])

import { inject } from "@vercel/analytics"