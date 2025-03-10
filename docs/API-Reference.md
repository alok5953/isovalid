# IsoValid API Reference

## Table of Contents

- [Core API](#core-api)
  - [String Validation](#string-validation)
  - [Number Validation](#number-validation)
  - [Common Methods](#common-methods)
- [Validation Results](#validation-results)
- [Types and Interfaces](#types-and-interfaces)
- [Custom Validation](#custom-validation)

## Core API

### String Validation

```typescript
import { v } from '@alok5953/isovalid';

const stringSchema = v.string()
```

#### Available Methods

| Method | Description | Example |
|--------|-------------|---------|
| `min(length: number)` | Set minimum string length | `v.string().min(3)` |
| `max(length: number)` | Set maximum string length | `v.string().max(20)` |
| `email()` | Validate email format | `v.string().email()` |
| `matches(pattern: RegExp)` | Match against regex pattern | `v.string().matches(/^[A-Z]+$/)` |
| `trimmed()` | Auto-trim whitespace | `v.string().trimmed()` |
| `custom(fn)` | Add custom validation | See [Custom Validation](#custom-validation) |

### Number Validation

```typescript
const numberSchema = v.number()
```

#### Available Methods

| Method | Description | Example |
|--------|-------------|---------|
| `min(value: number)` | Set minimum value | `v.number().min(0)` |
| `max(value: number)` | Set maximum value | `v.number().max(100)` |
| `integer()` | Must be an integer | `v.number().integer()` |
| `positive()` | Must be > 0 | `v.number().positive()` |
| `custom(fn)` | Add custom validation | See [Custom Validation](#custom-validation) |

### Common Methods

These methods are available on all schema types:

| Method | Description | Example |
|--------|-------------|---------|
| `setOptional()` | Allow undefined values | `v.string().setOptional()` |
| `setNullable()` | Allow null values | `v.string().setNullable()` |
| `custom(fn)` | Add custom validation | `v.string().custom(value => ...)` |

## Validation Results

All validation methods return a `ValidationResult` object:

```typescript
interface ValidationResult {
  valid: boolean;
  errors: Array<{
    path: string[];
    message: string;
  }>;
}
```

Example usage:
```typescript
const schema = v.string().email();
const result = schema.validate('invalid-email');

console.log(result);
// {
//   valid: false,
//   errors: [{
//     path: [],
//     message: 'Invalid email format'
//   }]
// }
```

## Types and Interfaces

### Schema Types

```typescript
type SchemaType = 'string' | 'number';

interface BaseSchema<T> {
  type: SchemaType;
  validate(value: unknown): ValidationResult;
}

interface StringSchema extends BaseSchema<string> {
  min(length: number): this;
  max(length: number): this;
  email(): this;
  matches(pattern: RegExp): this;
  trimmed(): this;
  custom(validator: CustomValidator): this;
}

interface NumberSchema extends BaseSchema<number> {
  min(value: number): this;
  max(value: number): this;
  integer(): this;
  positive(): this;
  custom(validator: CustomValidator): this;
}
```

### Custom Validation

Custom validators are functions that take a value and return either null (valid) or an error message:

```typescript
type CustomValidator = (value: unknown) => string | null;

// Example usage
const passwordSchema = v.string()
  .custom(value => {
    if (typeof value !== 'string') return 'Must be a string';
    if (value.length < 8) return 'Must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Must contain uppercase letter';
    return null; // validation passed
  });
```

## Error Handling

IsoValid provides detailed error messages:

```typescript
const schema = v.string().email();
const result = schema.validate('invalid');

// Access error details
if (!result.valid) {
  result.errors.forEach(error => {
    console.log(`Path: ${error.path.join('.')}`);
    console.log(`Message: ${error.message}`);
  });
}
```

## TypeScript Integration

IsoValid is built with TypeScript and provides excellent type inference:

```typescript
// Schema with inferred types
const userSchema = {
  name: v.string().min(2),
  age: v.number().min(0)
};

// TypeScript infers:
type User = {
  name: string;
  age: number;
};
```

## Performance Considerations

- Create schemas once and reuse them
- Use `trimmed()` only when necessary
- Avoid complex regex patterns in `matches()`
- Cache validation results when appropriate

## Best Practices

1. **Schema Organization**
   ```typescript
   // schemas/user.ts
   export const userSchema = {
     username: v.string().min(3),
     email: v.string().email()
   };
   ```

2. **Error Handling**
   ```typescript
   const validate = (data: unknown) => {
     const result = schema.validate(data);
     if (!result.valid) {
       throw new ValidationError(result.errors);
     }
     return data;
   };
   ```

3. **Custom Validation**
   ```typescript
   const customValidator = (value: unknown): string | null => {
     // Return null if valid
     // Return error message if invalid
   };
   ```

## Need Help?

- Check our [Examples](Examples) for more usage patterns
- Read the [Getting Started](Getting-Started) guide
- [Report issues](https://github.com/alok5953/isovalid/issues)
- Contact [Alok Kaushik](mailto:alokkaushik5953@gmail.com) for support
