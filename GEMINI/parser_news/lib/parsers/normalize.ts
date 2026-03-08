export interface Article {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  imageUrl: string | null;
  source: {
    name: string;
    domain: string;
    favicon: string;
  };
  publishedAt: Date;
  keywords: string[];
  rawScore: number;
}
