// === Developer Console Warning ===
window.addEventListener("load", () => {
  setTimeout(() => {
    console.log("%cStop!", "color: red; font-size: 40px; font-weight: bold;");
    console.log(
      "%cThis browser feature is intended for developers. If someone told you to copy and paste something here, it could be a scam and give them access to your accounts or device.",
      "font-size: 16px; max-width: 600px;"
    );
    console.log(
      "%cUnless you know exactly what you're doing, close this window and stay safe.",
      "font-size: 14px;"
    );
    window.scrollTo(0, 0);
  }, 0);
});

// === Constants & Cached DOM ===
let navbar, toggleBtn, menu, icon;
const barsIcon = "../public/images/icons/bars.svg";
const closeIcon = "../public/images/icons/close.svg";

let scrollTimeout;
let lastScrollTop = 0;

// === Intersection Observer for fade-in elements ===
const appearOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -50px 0px",
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  }
}, appearOptions);

// === Utility Functions ===
function setIcon() {
  if (icon) {
    icon.src = icon.src.endsWith("bars.svg") ? closeIcon : barsIcon;
  }
}

function closeMenuOnScroll() {
  if (menu?.classList.contains("active")) {
    menu.classList.remove("active");
    toggleBtn?.classList.add("open");
    setIcon();
  }
}

// === Device Detection ===
function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// === Scroll Logic with Class Toggle for Better Performance ===
function scrollLogic() {
  const currentScroll = window.scrollY;
  if (navbar) {
    if (currentScroll > lastScrollTop) {
      navbar.classList.add("hidden");
    } else {
      navbar.classList.remove("hidden");
    }
  }
  lastScrollTop = Math.max(currentScroll, 0);
  closeMenuOnScroll();
}

// === Scroll Handler with Conditional RAF on Desktop ===
function handleScroll() {
  if (isMobileDevice()) {
    // Run directly on mobile to avoid RAF overhead
    scrollLogic();
  } else {
    // Use RAF on desktop for smoothness
    requestAnimationFrame(scrollLogic);
  }
}

// === Initialize Fade-in Elements with Deferred Execution ===
function initFadeIn() {
  const faders = document.querySelectorAll(".fade-in");
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      faders.forEach(el => appearOnScroll.observe(el));
    });
  } else {
    setTimeout(() => {
      faders.forEach(el => appearOnScroll.observe(el));
    }, 100);
  }
}

// === Attach Navigation Link Handlers Deferred ===
function attachNavLinkHandlers() {
  document.querySelectorAll(".nav-item a").forEach(link => {
    link.addEventListener("click", () => {
      if (menu?.classList.contains("active")) {
        menu.classList.remove("active");
        toggleBtn?.classList.add("open");
        setIcon();
      }
    });
  });
}

// === Attach Menu Toggle Handler ===
function attachToggleHandler() {
  toggleBtn?.addEventListener("click", () => {
    menu?.classList.toggle("active");
    toggleBtn.classList.toggle("open");
    setIcon();
  });
}

// === DOM Ready Initialization ===
window.addEventListener("DOMContentLoaded", () => {
  navbar = document.getElementById("navbar");
  toggleBtn = document.getElementById("menu-toggle");
  menu = document.querySelector(".menu-items");
  icon = toggleBtn?.querySelector("img");

  initFadeIn();

  const initDeferred = () => {
    attachNavLinkHandlers();
    attachToggleHandler();
  };

  if ("requestIdleCallback" in window) {
    requestIdleCallback(initDeferred, { timeout: 200 });
  } else {
    setTimeout(initDeferred, 100);
  }
});

// === Scroll Throttle with Passive Event Listener ===
window.addEventListener(
  "scroll",
  () => {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(() => {
        handleScroll();
        scrollTimeout = null;
      }, 100);
    }
  },
  { passive: true }
);