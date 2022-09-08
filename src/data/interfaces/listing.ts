export interface IListing {
    id: string;
    title: string;
    description?: string;
    images: string[];
    primaryImageId?: number;
    price: number;
    duration: string;
    attributes: { [key: string]: string[] };
}