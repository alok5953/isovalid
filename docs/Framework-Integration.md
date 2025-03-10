# Framework Integration Guide

This guide demonstrates how to integrate IsoValid with popular frameworks and libraries. Created by [Alok Kaushik](https://github.com/alok5953), IsoValid is designed to work seamlessly with any JavaScript/TypeScript framework.

## Table of Contents
- [React Integration](#react-integration)
- [Express Integration](#express-integration)
- [Vue Integration](#vue-integration)
- [Next.js Integration](#nextjs-integration)
- [Nest.js Integration](#nestjs-integration)

## React Integration

### Form Validation with React Hooks

```typescript
import React, { useState } from 'react';
import { v } from '@alok5953/isovalid';

// Define your schema
const loginSchema = {
  email: v.string()
    .email()
    .trimmed(),
  password: v.string()
    .min(8)
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/)
};

export const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: keyof typeof loginSchema, value: string) => {
    const result = loginSchema[name].validate(value);
    return result.valid ? '' : result.errors[0].message;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const error = validateField(name as keyof typeof loginSchema, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validate all fields
    Object.entries(loginSchema).forEach(([field, schema]) => {
      const result = schema.validate(formData[field as keyof typeof formData]);
      if (!result.valid) {
        newErrors[field] = result.errors[0].message;
      }
    });

    if (Object.keys(newErrors).length === 0) {
      // Form is valid, proceed with submission
      try {
        // Your API call here
        console.log('Form submitted:', formData);
      } catch (error) {
        console.error('Submission error:', error);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? 'error' : ''}
        />
        {errors.password && <span className="error-message">{errors.password}</span>}
      </div>

      <button type="submit">Login</button>
    </form>
  );
};
```

### React Custom Hook

```typescript
import { useState, useCallback } from 'react';
import { v } from '@alok5953/isovalid';

export function useValidation<T extends Record<string, any>>(schema: Record<keyof T, ReturnType<typeof v.string | typeof v.number>>) {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validate = useCallback((data: T) => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.entries(schema).forEach(([field, validator]) => {
      const result = validator.validate(data[field as keyof T]);
      if (!result.valid) {
        isValid = false;
        newErrors[field as keyof T] = result.errors[0].message;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [schema]);

  return { errors, validate, setErrors };
}

// Usage Example
const MyForm = () => {
  const schema = {
    name: v.string().min(2),
    age: v.number().min(18)
  };

  const { errors, validate } = useValidation(schema);
  // ... rest of your component
};
```

## Express Integration

### Middleware-based Validation

```typescript
import { Request, Response, NextFunction } from 'express';
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

// Validation middleware
export const validateUser = (req: Request, res: Response, next: NextFunction) => {
  const errors: Record<string, string[]> = {};
  
  Object.entries(userSchema).forEach(([field, schema]) => {
    const result = schema.validate(req.body[field]);
    if (!result.valid) {
      errors[field] = result.errors.map(e => e.message);
    }
  });

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: 'error',
      errors
    });
  }

  next();
};

// Use in your routes
app.post('/api/users', validateUser, (req, res) => {
  // Your handler logic here
  res.status(201).json({ status: 'success', data: req.body });
});
```

## Vue Integration

### Vue 3 Composition API

```typescript
import { ref, computed } from 'vue';
import { v } from '@alok5953/isovalid';

export function useValidation(schema: Record<string, any>) {
  const errors = ref<Record<string, string>>({});
  
  const validate = (data: Record<string, any>) => {
    const newErrors: Record<string, string> = {};
    
    Object.entries(schema).forEach(([field, validator]) => {
      const result = validator.validate(data[field]);
      if (!result.valid) {
        newErrors[field] = result.errors[0].message;
      }
    });
    
    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
  };
  
  const hasErrors = computed(() => Object.keys(errors.value).length > 0);
  
  return {
    errors,
    validate,
    hasErrors
  };
}

// Usage in a Vue component
export default {
  setup() {
    const formData = ref({
      email: '',
      password: ''
    });
    
    const schema = {
      email: v.string().email(),
      password: v.string().min(8)
    };
    
    const { errors, validate, hasErrors } = useValidation(schema);
    
    const handleSubmit = () => {
      if (validate(formData.value)) {
        // Proceed with form submission
      }
    };
    
    return {
      formData,
      errors,
      hasErrors,
      handleSubmit
    };
  }
};
```

## Next.js Integration

### API Route Validation

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { v } from '@alok5953/isovalid';

const userSchema = {
  name: v.string().min(2),
  email: v.string().email()
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const errors: Record<string, string[]> = {};
  
  Object.entries(userSchema).forEach(([field, schema]) => {
    const result = schema.validate(req.body[field]);
    if (!result.valid) {
      errors[field] = result.errors.map(e => e.message);
    }
  });

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  // Process valid data
  res.status(200).json({ message: 'Success' });
}
```

## Nest.js Integration

### Custom Validation Pipe

```typescript
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { v } from '@alok5953/isovalid';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private schema: Record<string, any>) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const errors: Record<string, string[]> = {};

    Object.entries(this.schema).forEach(([field, validator]) => {
      const result = validator.validate(value[field]);
      if (!result.valid) {
        errors[field] = result.errors.map(e => e.message);
      }
    });

    if (Object.keys(errors).length > 0) {
      throw new BadRequestException({ errors });
    }

    return value;
  }
}

// Usage in a controller
@Post()
async create(@Body(new ValidationPipe({
  name: v.string().min(2),
  email: v.string().email()
})) createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}
```

## Best Practices

1. **Schema Reusability**
   - Define schemas in separate files
   - Share schemas between frontend and backend
   - Use TypeScript for better type inference

2. **Error Handling**
   - Provide clear error messages
   - Handle both field-level and form-level validation
   - Use consistent error formats

3. **Performance**
   - Create schemas once, reuse them
   - Validate only changed fields during user input
   - Consider debouncing for real-time validation

4. **Security**
   - Always validate on the server side
   - Don't trust client-side validation alone
   - Sanitize input data

## Need Help?

- Check our [Examples](Examples) for more patterns
- Read the [API Reference](API-Reference)
- [Report issues](https://github.com/alok5953/isovalid/issues)
- Contact [Alok Kaushik](mailto:alokkaushik5953@gmail.com) for support

## Contributing

We welcome contributions! Please read our [Contributing Guide](Contributing) for details on how to submit pull requests, report issues, and contribute to the project.
