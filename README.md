# IsoValid

[![npm version](https://badge.fury.io/js/%40alok5953%2Fisovalid.svg)](https://badge.fury.io/js/%40alok5953%2Fisovalid)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/alok5953/isovalid/blob/main/CONTRIBUTING.md)

A lightweight, isomorphic data validation library for TypeScript and JavaScript that works seamlessly in both browser and Node.js environments. IsoValid is designed to provide a unified validation experience across your entire application stack.

> Created and maintained by [Alok Kaushik](https://github.com/alok5953) | [alok5953@gmail.com](mailto:alok5953@gmail.com)

## Why IsoValid?

In modern web applications, data validation is crucial at multiple layers:
- Client-side form validation for immediate user feedback
- API request/response validation for data integrity
- Server-side validation for security

Traditionally, developers had to:
1. Write separate validation logic for frontend and backend
2. Maintain multiple validation libraries
3. Deal with inconsistencies between environments

IsoValid solves these problems by providing:
- 🌐 **True Isomorphic Support** - The exact same validation code runs in both browser and Node.js
- 🎯 **TypeScript-First Design** - Built from the ground up with TypeScript for excellent type inference
- 🪶 **Minimal Bundle Size** - Core validation features without unnecessary bloat
- 🔄 **Developer-Friendly API** - Intuitive, chainable interface for building schemas
- ⚡ **High Performance** - Optimized validation with minimal overhead
- 🎨 **Extensible Design** - Easy to add custom validators and error messages

## Installation

```bash
npm install isovalid
```

## Architecture

IsoValid is built on a flexible, extensible architecture:

### Core Components

1. **Base Schema Class**
   - Abstract foundation for all schema types
   - Handles common validation logic
   - Manages optional/nullable states

2. **Type-Specific Schemas**
   - StringSchema: String validation with length, pattern, format checks
   - NumberSchema: Numeric validation with range, integer, sign checks
   - More types coming soon (Boolean, Array, Object)

3. **Validation Pipeline**
   - Multi-stage validation process
   - Custom validator support
   - Detailed error reporting

## API Reference

### String Validation

```typescript
const stringSchema = v.string()
  .min(2)           // Minimum length
  .max(50)          // Maximum length
  .email()          // Email format
  .matches(/regex/) // Custom regex pattern
  .trimmed()        // Auto-trim whitespace
  .setOptional()    // Allow undefined
  .setNullable()    // Allow null
  .custom(value => value.includes('@') ? null : 'Must include @'); // Custom validation
```

### Number Validation

```typescript
const numberSchema = v.number()
  .min(0)         // Minimum value
  .max(100)       // Maximum value
  .integer()      // Must be an integer
  .positive()     // Must be > 0
  .setOptional()  // Allow undefined
  .setNullable(); // Allow null
```

### Validation Results

All validations return a structured result:

```typescript
interface ValidationResult {
  valid: boolean;
  errors: Array<{
    path: string[];
    message: string;
  }>;
}
```

## Real-World Examples

### 1. React Form Validation

```typescript
import { v } from 'isovalid';
import { useState, FormEvent } from 'react';

const userSchema = {
  username: v.string().min(3).max(20),
  email: v.string().email(),
  age: v.number().integer().min(18)
};

function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    age: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: keyof typeof userSchema, value: any) => {
    const result = userSchema[field].validate(value);
    return result.valid ? null : result.errors[0].message;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    // Validate all fields
    Object.entries(formData).forEach(([field, value]) => {
      const error = validateField(field as keyof typeof userSchema, value);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length === 0) {
      // Form is valid, submit data
      console.log('Submitting:', formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          value={formData.username}
          onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
          placeholder="Username"
        />
        {errors.username && <span className="error">{errors.username}</span>}
      </div>
      {/* Similar fields for email and age */}
      <button type="submit">Register</button>
    </form>
  );
}
```

### 2. Express API Validation

```typescript
import express from 'express';
import { v } from 'isovalid';

const app = express();
app.use(express.json());

const productSchema = {
  name: v.string().min(3).max(100),
  price: v.number().min(0),
  category: v.string().custom(value =>
    ['electronics', 'books', 'clothing'].includes(value)
      ? null
      : 'Invalid category'
  )
};

app.post('/api/products', (req, res) => {
  const errors = Object.entries(productSchema)
    .map(([field, schema]) => ({
      field,
      result: schema.validate(req.body[field])
    }))
    .filter(({ result }) => !result.valid)
    .map(({ field, result }) => ({
      field,
      message: result.errors[0].message
    }));

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Process valid product data
  const product = req.body;
  // Save to database, etc.
  res.status(201).json(product);
});
```

## Best Practices

1. **Schema Reuse**
   - Define schemas once and share between frontend and backend
   - Keep schemas in a shared directory accessible to both environments

2. **Type Safety**
   - Leverage TypeScript's type inference with IsoValid
   - Define interfaces that match your schemas

3. **Performance**
   - Create schemas outside request handlers
   - Reuse schema instances when possible

4. **Error Handling**
   - Always check the `valid` property before accessing data
   - Provide user-friendly error messages in custom validators

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch
3. Write tests for your changes
4. Submit a pull request

## Testing

IsoValid uses Jest for testing. Run the test suite:

```bash
npm test
```

Current test coverage: >88%

## Roadmap

- [ ] Array schema type
- [ ] Object schema type with nested validation
- [ ] Custom error message templates
- [ ] Async validation support
- [ ] Integration with popular form libraries
- [ ] Schema composition and inheritance

## License

MIT © [IsoValid](LICENSE)

## Support

- GitHub Issues: Report bugs and feature requests
- Documentation: Check our [Wiki](https://github.com/isovalid/isovalid/wiki)
- Stack Overflow: Tag your questions with `isovalid`
