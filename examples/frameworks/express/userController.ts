import { Request, Response } from 'express';
import { v } from '@alok5953/isovalid';

// Define validation schemas
const userSchema = {
  username: v.string()
    .min(3)
    .max(20)
    .matches(/^[a-zA-Z0-9_]+$/)
    .custom(value => 
      ['admin', 'root', 'system'].includes(String(value).toLowerCase())
        ? 'Reserved username not allowed'
        : null
    ),
  email: v.string()
    .email()
    .trimmed(),
  age: v.number()
    .integer()
    .min(18)
    .max(120),
  preferences: v.string()
    .setOptional()
    .setNullable()
};

// Validation middleware
export const validateUser = (req: Request, res: Response, next: Function) => {
  const errors: Record<string, string[]> = {};
  
  Object.entries(userSchema).forEach(([field, schema]) => {
    if (field in req.body || !schema['_optional']) {
      const result = schema.validate(req.body[field]);
      if (!result.valid) {
        errors[field] = result.errors.map(e => e.message);
      }
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

// Example route handlers
export const userController = {
  // Create user
  createUser: async (req: Request, res: Response) => {
    try {
      // At this point, data is already validated by middleware
      const userData = req.body;
      
      // Simulate database operation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      res.status(201).json({
        status: 'success',
        data: {
          ...userData,
          id: Math.random().toString(36).substr(2, 9)
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  },

  // Update user
  updateUser: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const updateData = req.body;
      
      // Validate partial updates
      const errors: Record<string, string[]> = {};
      
      Object.entries(updateData).forEach(([field, value]) => {
        if (field in userSchema) {
          const schema = userSchema[field as keyof typeof userSchema];
          const result = schema.validate(value);
          if (!result.valid) {
            errors[field] = result.errors.map(e => e.message);
          }
        }
      });

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          status: 'error',
          errors
        });
      }

      // Simulate database operation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      res.json({
        status: 'success',
        data: {
          id: userId,
          ...updateData
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }
};
