export type ValidationError = {
  path: string[];
  message: string;
};

export type ValidationResult = {
  valid: boolean;
  errors: ValidationError[];
};

export type SchemaType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'object'
  | 'null'
  | 'undefined';

export interface BaseSchema<T> {
  type: SchemaType;
  optional?: boolean;
  nullable?: boolean;
  validate(value: unknown): ValidationResult;
  isValid(value: unknown): boolean;
  cast(value: unknown): T;
}
