import { Options } from '../features/listings/types/listing';

export type GetOptionType<T extends Options> = T extends infer U ? U : never;
export type GetRecordKeys<T extends Record<string, any>> = keyof T;
export type GetElementType<T extends any[]> = T extends (infer U)[] ? U : never;

// Filter keys based on type
export type FilteredKeys<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never;
}[keyof T];
