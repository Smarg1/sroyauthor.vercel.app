// Dev console warning
console.log("%cStop!", "color: red; font-size: 40px; font-weight: bold;");
console.log(
  "%cThis browser feature is intended for developers. If someone told you to copy and paste something here, it could be a scam and give them access to your account.",
  "font-size: 16px; max-width: 600px;"
);
console.log(
  "%cUnless you know exactly what you're doing, close this window and stay safe.",
  "font-size: 14px;"
);

// Fade-in on scroll
document.addEventListener("DOMContentLoaded", () => {
  const faders = document.querySelectorAll(".fade-in");
  const appearOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(fader => appearOnScroll.observe(fader));
});

// Hide/show navbar on scroll
let lastScrollTop = 0;
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  navbar.style.top = currentScroll > lastScrollTop ? "-100px" : "0";
  lastScrollTop = Math.max(currentScroll, 0);
});

// Mobile nav toggle
const toggleBtn = document.getElementById("menu-toggle");
const menu = document.getElementById("menu-items");

toggleBtn?.addEventListener("click", () => {
  menu.classList.toggle("active");
});

// Auto-close mobile nav when link is clicked
document.querySelectorAll(".nav-item a").forEach(link => {
  link.addEventListener("click", () => {
    menu.classList.remove("active");
  });
});

// Auto-close menu on scroll
window.addEventListener("scroll", () => {
  if (menu.classList.contains("active")) {
    menu.classList.remove("active");
  }
});
