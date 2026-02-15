import type {
  AwardItem,
  FeaturedWorkItem,
  LatestVideoItem,
  PhotoItem,
} from "../types/content";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)
  ?.replace(/\/$/, "") || "http://localhost:5000/api";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

export const contentApi = {
  getBehindScenes: () => request<PhotoItem[]>("/photography/behind-scenes"),
  getCampusEvents: () => request<PhotoItem[]>("/photography/campus-events"),
  getPortraitLandscape: () => request<PhotoItem[]>("/photography/portrait-landscape"),
  getAwards: () => request<AwardItem[]>("/awards"),
  getLatestVideos: () => request<LatestVideoItem[]>("/latest-videos"),
  getFeaturedWork: () => request<FeaturedWorkItem[]>("/featured-work"),
};
