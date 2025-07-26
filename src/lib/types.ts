
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
  _id: string;
  name: string;
  location: string;
  description: string;
  bannerUrl: string;
}

export type Feature = {
  _id: string;
  icon: any;
  title: string;
  description: string;
  color: string;
};

export type Testimonial = {
  _id: string;
  quote: string;
  author: string;
};

export type Faq = {
  _id: string;
  question: string;
  answer: string;
};
