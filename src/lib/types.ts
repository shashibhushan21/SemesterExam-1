export type Note = {
  id: string;
  title: string;
  university: string;
  subject: string;
  semester: string;
  author: string;
  authorAvatar: string;
  uploadDate: string;
  summary: string;
  rating: number;
  thumbnailUrl: string;
  content: string;
};

export type University = {
  name: string;
  location: string;
  description: string;
  bannerUrl: string;
}
