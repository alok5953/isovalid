import { v } from '@alok5953/isovalid';

// Define a complete user registration schema
const userRegistrationSchema = {
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

  score: v.number()
    .min(0)
    .max(100)
    .setOptional(),
};

// Example user data
const validUser = {
  username: 'john_doe',
  email: 'john@example.com',
  age: 25,
  score: 85
};

const invalidUser = {
  username: 'ad',           // Too short
  email: 'invalid-email',   // Invalid email
  age: 15,                 // Too young
  score: 101               // Above maximum
};

// Validate all fields and collect errors
function validateUser(data: any) {
  const errors: Record<string, string[]> = {};
  
  Object.entries(userRegistrationSchema).forEach(([field, schema]) => {
    const result = schema.validate(data[field]);
    if (!result.valid) {
      errors[field] = result.errors.map(e => e.message);
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

// Example usage
console.log('\n=== Valid User Registration ===');
console.log(validateUser(validUser));

console.log('\n=== Invalid User Registration ===');
console.log(validateUser(invalidUser));

// Example of partial updates
const partialUpdate = {
  username: 'jane_doe',
  email: 'jane@example.com'
};

function validatePartialUpdate(data: Partial<typeof validUser>) {
  const errors: Record<string, string[]> = {};
  
  Object.entries(data).forEach(([field, value]) => {
    const schema = userRegistrationSchema[field as keyof typeof userRegistrationSchema];
    if (schema) {
      const result = schema.validate(value);
      if (!result.valid) {
        errors[field] = result.errors.map(e => e.message);
      }
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

console.log('\n=== Partial Update Validation ===');
console.log(validatePartialUpdate(partialUpdate));
