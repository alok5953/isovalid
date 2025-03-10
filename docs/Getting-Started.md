# Getting Started with IsoValid

## Installation

```bash
# Using npm
npm install @alok5953/isovalid

# Using yarn
yarn add @alok5953/isovalid

# Using pnpm
pnpm add @alok5953/isovalid
```

## Basic Usage

```typescript
import { v } from '@alok5953/isovalid';

// Define your schema
const userSchema = {
  username: v.string()
    .min(3)
    .max(20)
    .matches(/^[a-zA-Z0-9_]+$/),
  email: v.string()
    .email()
    .trimmed(),
  age: v.number()
    .min(18)
    .integer()
};

// Validate data
const data = {
  username: 'john_doe',
  email: 'john@example.com',
  age: 25
};

// Validate individual fields
const usernameResult = userSchema.username.validate(data.username);
console.log(usernameResult);
// { valid: true, errors: [] }

// Validate with invalid data
const invalidResult = userSchema.age.validate(16);
console.log(invalidResult);
// { 
//   valid: false, 
//   errors: [{ 
//     path: [], 
//     message: 'Number must be greater than or equal to 18' 
//   }] 
// }
```

## TypeScript Support

IsoValid is built with TypeScript and provides excellent type inference:

```typescript
import { v } from '@alok5953/isovalid';

// Schema with inferred types
const userSchema = {
  name: v.string().min(2),
  age: v.number().min(0)
};

// TypeScript will infer this type:
type User = {
  name: string;
  age: number;
};

// Validation preserves types
const validateUser = (data: unknown): data is User => {
  return Object.entries(userSchema).every(
    ([key, schema]) => schema.validate(data[key]).valid
  );
};
```

## Core Concepts

### 1. Schemas

Schemas are the building blocks of validation in IsoValid:

```typescript
// String Schema
const stringSchema = v.string()
  .min(2)           // Minimum length
  .max(50)          // Maximum length
  .email()          // Email format
  .matches(/regex/) // Custom regex pattern
  .trimmed();       // Auto-trim whitespace

// Number Schema
const numberSchema = v.number()
  .min(0)         // Minimum value
  .max(100)       // Maximum value
  .integer()      // Must be an integer
  .positive();    // Must be > 0
```

### 2. Optional and Nullable Fields

Fields can be made optional or nullable:

```typescript
const schema = {
  requiredField: v.string(),
  optionalField: v.string().setOptional(),
  nullableField: v.string().setNullable(),
  optionalAndNullable: v.string()
    .setOptional()
    .setNullable()
};
```

### 3. Custom Validation

Add custom validation logic:

```typescript
const passwordSchema = v.string()
  .min(8)
  .custom(value => {
    if (!/[A-Z]/.test(value)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(value)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(value)) {
      return 'Password must contain at least one number';
    }
    return null; // validation passed
  });
```

## Next Steps

- Check out our [Examples](Examples) for more usage patterns
- Learn about [Framework Integration](Framework-Integration)
- Read the complete [API Reference](API-Reference)
- Understand how to [Contribute](Contributing)

## Need Help?

- [Report a bug](https://github.com/alok5953/isovalid/issues/new?template=bug_report.md)
- [Request a feature](https://github.com/alok5953/isovalid/issues/new?template=feature_request.md)
- Contact [Alok Kaushik](mailto:alokkaushik5953@gmail.com) for support
