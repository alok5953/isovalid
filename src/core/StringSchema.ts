import { Schema } from './Schema';
import { ValidationResult } from '../types/schema';

export class StringSchema extends Schema<string> {
  private minLength?: number;
  private maxLength?: number;
  private pattern?: RegExp;
  private trim: boolean = false;

  constructor() {
    super('string');
  }

  min(length: number): this {
    this.minLength = length;
    return this;
  }

  max(length: number): this {
    this.maxLength = length;
    return this;
  }

  matches(regex: RegExp): this {
    this.pattern = regex;
    return this;
  }

  email(): this {
    this.pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return this;
  }

  trimmed(): this {
    this.trim = true;
    return this;
  }

  cast(value: unknown): string {
    if (typeof value === 'string') {
      return this.trim ? value.trim() : value;
    }
    return String(value);
  }

  validate(value: unknown, path: string[] = []): ValidationResult {
    const baseValidation = this.validateValue(value, path);
    if (!baseValidation.valid || value == null) {
      return baseValidation;
    }

    const errors = [...baseValidation.errors];
    const strValue = this.cast(value);

    if (typeof strValue !== 'string') {
      errors.push({
        path,
        message: `Expected string, received ${typeof strValue}`
      });
      return { valid: false, errors };
    }

    if (this.minLength !== undefined && strValue.length < this.minLength) {
      errors.push({
        path,
        message: `String must be at least ${this.minLength} characters long`
      });
    }

    if (this.maxLength !== undefined && strValue.length > this.maxLength) {
      errors.push({
        path,
        message: `String must be at most ${this.maxLength} characters long`
      });
    }

    if (this.pattern && !this.pattern.test(strValue)) {
      errors.push({
        path,
        message: 'String does not match required pattern'
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
