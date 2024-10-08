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
  collectionId: string;
  collectionName: string;
  content: string;
  created: string;
  date: string;
  id: string;
  images: string[];
  page_id: string;
  show: boolean;
  tags: string[];
  thumbnail: string;
  title: string;
  updated: string;
  videos: string[];
};