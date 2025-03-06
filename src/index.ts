import { StringSchema } from './core/StringSchema';
import { NumberSchema } from './core/NumberSchema';

export const v = {
  string: () => new StringSchema(),
  number: () => new NumberSchema(),
};

export * from './types/schema';
export * from './core/Schema';
export * from './core/StringSchema';
export * from './core/NumberSchema';
