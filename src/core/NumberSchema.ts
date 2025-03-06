import { Schema } from './Schema';
import { ValidationResult } from '../types/schema';

export class NumberSchema extends Schema<number> {
  private minValue?: number;
  private maxValue?: number;
  private isInteger: boolean = false;
  private isPositive: boolean = false;

  constructor() {
    super('number');
  }

  min(value: number): this {
    this.minValue = value;
    return this;
  }

  max(value: number): this {
    this.maxValue = value;
    return this;
  }

  integer(): this {
    this.isInteger = true;
    return this;
  }

  positive(): this {
    this.isPositive = true;
    return this;
  }

  cast(value: unknown): number {
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      const num = Number(value);
      if (isNaN(num)) {
        throw new Error('Cannot cast string to number');
      }
      return num;
    }
    throw new Error('Cannot cast value to number');
  }

  validate(value: unknown, path: string[] = []): ValidationResult {
    const baseValidation = this.validateValue(value, path);
    if (!baseValidation.valid || value == null) {
      return baseValidation;
    }

    const errors = [...baseValidation.errors];
    let numValue: number;

    try {
      numValue = this.cast(value);
    } catch (e) {
      errors.push({
        path,
        message: `Expected number, received ${typeof value}`
      });
      return { valid: false, errors };
    }

    if (this.isInteger && !Number.isInteger(numValue)) {
      errors.push({
        path,
        message: 'Number must be an integer'
      });
    }

    if (this.isPositive && numValue <= 0) {
      errors.push({
        path,
        message: 'Number must be positive'
      });
    }

    if (this.minValue !== undefined && numValue < this.minValue) {
      errors.push({
        path,
        message: `Number must be greater than or equal to ${this.minValue}`
      });
    }

    if (this.maxValue !== undefined && numValue > this.maxValue) {
      errors.push({
        path,
        message: `Number must be less than or equal to ${this.maxValue}`
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
