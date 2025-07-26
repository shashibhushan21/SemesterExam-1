export type Note = {
  _id: string;
  title: string;
  university: string;
  subject: string;
  semester: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  summary: string;
  rating: number;
  thumbnailUrl: string;
  pdfUrl: string;
  content: string;
  branch: string;
};

export type University = {
  name: string;
  location: string;
  description: string;
  bannerUrl: string;
}
