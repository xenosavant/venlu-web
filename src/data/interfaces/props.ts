import { ListingData, ResponseStatus } from '@listings/listingsReducer';
import { IListing } from '../../features/listings/types/listing';

export interface ChildProps {
  children?: React.ReactNode;
}

export interface Closeable {
  onClose: () => void;
}

export interface HasListing {
  listing: IListing;
}

export interface HasListings {
  listings: ListingData;
  listingsStatus: ResponseStatus;
}

export type CanUpdate<T> = {
  update: ({}: Partial<T>) => void;
};
