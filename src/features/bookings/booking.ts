import { ListingFeatureTypes } from '../listings/types/listing';

export interface Booking {
  id?: string;
  listingId: string;
  userId: string;
  schedule: Required<BookingDate>[];
}

// booking schedule can be a single day or a set of days, optionally with associated times for each day
export interface BookingDate {
  type: ListingFeatureTypes['event'];
  startDateTime?: string;
  endDateTime?: string;
}
