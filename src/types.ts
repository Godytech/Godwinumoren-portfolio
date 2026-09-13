export interface HeroContent {
  headline: string;
  name: string;
  role: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  resumeUrl: string;
  availableForWork: boolean;
  badgeId: string;
  avatarUrl: string;
  location: string;
  experienceYears: string;
  specialty: string;
  cardName?: string;
  cardRopeColor?: string;
  cardAccentColor?: string;
  cardHeaderGradientStart?: string;
  cardHeaderGradientVia?: string;
  cardHeaderGradientEnd?: string;
  cardAvatarGlowColor?: string;
  cardBadgeBgColor?: string;
  nameColor1?: string;
  nameColor2?: string;
}

export interface AboutStat {
  id: string;
  icon: string;
  label: string;
  value: string;
}

export interface AboutContent {
  heading: string;
  highlight: string;
  description: string;
  stats: AboutStat[];
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  link: string;
  image: string;
  gridClass?: string;
  order: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface CareerEvent {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  icon?: string;
  order: number;
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  year: string;
  badge: string;
  details: string[];
  order: number;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number;
  category: "technical" | "soft";
  icon?: string;
  order: number;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  content: string;
  image: string;
  order: number;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface ContactContent {
  headline: string;
  subheadline: string;
  email: string;
  phone: string;
  location: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  socialLinks: SocialLink[];
}

export interface FooterContent {
  bannerLabel: string;
  animatedTexts: string[];
}

export interface PortfolioData {
  hero: HeroContent;
  about: AboutContent;
  projects: ProjectItem[];
  services: ServiceItem[];
  career: CareerEvent[];
  education: EducationItem[];
  skills: SkillItem[];
  testimonials: TestimonialItem[];
  contact: ContactContent;
  footer: FooterContent;
}
