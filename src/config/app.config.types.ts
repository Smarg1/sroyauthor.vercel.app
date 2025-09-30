export interface SocialLink {
  href: string;
  label: string;
  title: string;
  src: string;
  external?: boolean;
}

export interface FooterConfig {
  socialLinks: SocialLink[];
  copyright: string;
}

export interface AppConfig {
  meta: {
    title: string;
    desc: string;
    logo: string;
  };
  header: {
    title: string;
    subtitle: string;
    btntext: string;
    btnlink: string;
  };
  about: {
    name: string;
  };
  footer: FooterConfig;
}
