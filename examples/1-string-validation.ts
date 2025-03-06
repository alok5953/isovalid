import { v } from '@alok5953/isovalid';

// Basic String Validation
const usernameSchema = v.string()
  .min(3)           // Minimum length of 3
  .max(20)          // Maximum length of 20
  .trimmed();       // Auto-trim whitespace

console.log('\n=== Username Validation ===');
console.log('Valid username:', usernameSchema.validate('john_doe'));
console.log('Too short:', usernameSchema.validate('jo'));
console.log('With spaces:', usernameSchema.validate('  john  ')); // Will be trimmed

// Email Validation
const emailSchema = v.string()
  .email()          // Email format validation
  .setOptional()    // Make it optional
  .setNullable();   // Allow null values

console.log('\n=== Email Validation ===');
console.log('Valid email:', emailSchema.validate('user@example.com'));
console.log('Invalid email:', emailSchema.validate('not-an-email'));
console.log('Null value:', emailSchema.validate(null));
console.log('Undefined:', emailSchema.validate(undefined));

// Pattern Matching
const passwordSchema = v.string()
  .min(8)
  .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/) // At least one uppercase, lowercase, and digit
  .custom(value => 
    String(value).toLowerCase().includes('password') ? 'Password cannot contain the word "password"' : null
  );

console.log('\n=== Password Validation ===');
console.log('Valid password:', passwordSchema.validate('Test1234'));
console.log('No uppercase:', passwordSchema.validate('test1234'));
console.log('Contains "password":', passwordSchema.validate('myPassword123'));
