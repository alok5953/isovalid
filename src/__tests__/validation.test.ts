import { v } from '../index';

describe('Validation Library', () => {
  describe('StringSchema', () => {
    it('validates basic string requirements', () => {
      const schema = v.string();
      expect(schema.isValid('hello')).toBe(true);
      expect(schema.isValid(123)).toBe(true); // Auto-casting
      expect(schema.isValid(null)).toBe(false);
      expect(schema.isValid(undefined)).toBe(false);
    });

    it('handles optional strings', () => {
      const schema = v.string().setOptional();
      expect(schema.isValid(undefined)).toBe(true);
      expect(schema.isValid('hello')).toBe(true);
    });

    it('validates email format', () => {
      const schema = v.string().email();
      expect(schema.isValid('test@example.com')).toBe(true);
      expect(schema.isValid('invalid-email')).toBe(false);
    });

    it('validates string length constraints', () => {
      const schema = v.string().min(2).max(5);
      expect(schema.isValid('abc')).toBe(true);
      expect(schema.isValid('a')).toBe(false);
      expect(schema.isValid('too long')).toBe(false);
    });
  });

  describe('NumberSchema', () => {
    it('validates basic number requirements', () => {
      const schema = v.number();
      expect(schema.isValid(123)).toBe(true);
      expect(schema.isValid('123')).toBe(true); // Auto-casting
      expect(schema.isValid(null)).toBe(false);
      expect(schema.isValid(undefined)).toBe(false);
    });

    it('validates number range constraints', () => {
      const schema = v.number().min(0).max(100);
      expect(schema.isValid(50)).toBe(true);
      expect(schema.isValid(-1)).toBe(false);
      expect(schema.isValid(101)).toBe(false);
    });

    it('validates integer constraint', () => {
      const schema = v.number().integer();
      expect(schema.isValid(42)).toBe(true);
      expect(schema.isValid(42.5)).toBe(false);
    });

    it('validates positive numbers', () => {
      const schema = v.number().positive();
      expect(schema.isValid(42)).toBe(true);
      expect(schema.isValid(0)).toBe(false);
      expect(schema.isValid(-42)).toBe(false);
    });
  });

  describe('Error Messages', () => {
    it('provides detailed error messages', () => {
      const schema = v.string().email();
      const result = schema.validate('invalid-email');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0].message).toBe('String does not match required pattern');
    });

    it('supports custom validation with custom error messages', () => {
      const schema = v.string().custom(value => 
        String(value).includes('test') ? null : 'String must contain "test"'
      );
      
      const result = schema.validate('invalid');
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toBe('String must contain "test"');
    });
  });
});
