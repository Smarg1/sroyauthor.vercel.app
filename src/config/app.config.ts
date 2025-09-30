import { AppConfig } from "./app.config.types";

const socialLinks = [
  {
    href: "https://www.instagram.com/sroyauthor/",
    label: "Instagram",
    title: "Instagram",
    src: "/images/icons/instagram-brands.svg",
    external: true,
  },
  {
    href: "https://www.facebook.com/sroyauthor",
    label: "Facebook",
    title: "Facebook",
    src: "/images/icons/square-facebook-brands.svg",
    external: true,
  },
  {
    href: "https://www.linkedin.com/in/sangita-roy-067a88342/",
    label: "LinkedIn",
    title: "LinkedIn",
    src: "/images/icons/linkedin-brands.svg",
    external: true,
  },
  {
    href: "https://linktr.ee/sroyauthor",
    label: "Linktree",
    title: "Linktree",
    src: "/images/icons/linktree-logo-icon.svg",
    external: true,
  },
  {
    href: "mailto:sroy.hussain@gmail.com",
    label: "Email",
    title: "Email",
    src: "/images/icons/envelope-solid.svg",
  },
  {
    href: "https://www.goodreads.com/sangitaroy",
    label: "Goodreads",
    title: "Goodreads",
    src: "/images/icons/goodreads-brands-solid.svg",
    external: true,
  },
];

const appConfig: AppConfig = {
  meta: {
    title: "Sangita Roy | Author",
    desc: "Discover the enchanting world of Sangita Roy, a nature-fiction author blending nature and imagination through fiction.",
    logo: "/images/icons/logo.svg",
  },
  header: {
    title: "Where Fiction and the Soul of Nature Converge",
    subtitle: "Exploring the intricate bond between humanity and the earth’s secrets.",
    btntext: "Read More",
    btnlink: "/blogs",
  },
  about: {
    name: "Sangita Roy"
  },
  footer: {
    socialLinks,
    copyright: "© 2025 Sangita Roy. All rights reserved.",
  },
};

export default appConfig;
