export interface PhotoItem {
  _id: string;
  section: "behind-scenes" | "campus-events" | "portrait-landscape";
  imageUrl: string;
  caption: string;
  order: number;
}

export interface AwardItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  articleUrl: string;
  order: number;
}

export interface LatestVideoItem {
  _id: string;
  title: string;
  videoId: string;
  description: string;
  order: number;
}

export interface FeaturedWorkItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  order: number;
}

export interface HomeIntroItem {
  _id: string;
  description: string;
}

export interface ResumePdfItem {
  _id: string;
  fileName: string;
  mimeType: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  fileUrl: string;
}
