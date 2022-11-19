import { Options } from '../features/listings/types/listing';

export type GetOptionType<T extends Options> = T extends infer U ? U : never;
export type GetRecordKeys<T extends Record<string, any>> = keyof T;
export type GetElementType<T extends any[]> = T extends (infer U)[] ? U : never;
