import { IListing } from './listing';

export interface Closeable {
  onClose: () => void;
}

export interface HasListing {
  listing: IListing;
}

export type CanUpdate<T> = {
  update: ({ }: Partial<T>) => void;
}
