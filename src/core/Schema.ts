import { BaseSchema, SchemaType, ValidationError, ValidationResult } from '../types/schema';

export abstract class Schema<T> implements BaseSchema<T> {
  type: SchemaType;
  protected _optional: boolean;
  protected _nullable: boolean;
  private customValidators: ((value: unknown) => string | null)[];

  constructor(type: SchemaType) {
    this.type = type;
    this._optional = false;
    this._nullable = false;
    this.customValidators = [];
  }

  abstract validate(value: unknown): ValidationResult;
  abstract cast(value: unknown): T;

  isValid(value: unknown): boolean {
    return this.validate(value).valid;
  }

  get optional(): boolean {
    return this._optional;
  }

  get nullable(): boolean {
    return this._nullable;
  }

  setOptional(): this {
    this._optional = true;
    return this;
  }

  setNullable(): this {
    this._nullable = true;
    return this;
  }

  custom(validator: (value: unknown) => string | null): this {
    this.customValidators.push(validator);
    return this;
  }

  protected validateValue(value: unknown, path: string[] = []): ValidationResult {
    if (value === undefined) {
      return {
        valid: this.optional,
        errors: this.optional ? [] : [{ path, message: 'Value is required' }]
      };
    }

    if (value === null) {
      return {
        valid: this.nullable,
        errors: this.nullable ? [] : [{ path, message: 'Value cannot be null' }]
      };
    }

    const errors: ValidationError[] = [];
    
    // Run custom validators
    for (const validator of this.customValidators) {
      const error = validator(value);
      if (error) {
        errors.push({ path, message: error });
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
