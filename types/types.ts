export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  logo: string;
  keywords: string;
};

export type LinkType = {
  link: string;
  label: string;
  links?: LinkType[];
};

export type ProjectType = {
  id: string;
  thumbnail_url: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  image_links: string[];
  video_links: string[];
};