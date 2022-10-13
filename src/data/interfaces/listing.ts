export interface IListing {
  id?: string;
  title: string;
  description?: string;
  images: string[];
  primaryImageIndex: number;
  price: number;
  attributes: { [key: string]: string[] };
}
