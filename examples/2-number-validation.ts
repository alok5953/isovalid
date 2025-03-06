import { v } from '@alok5953/isovalid';

// Basic Number Validation
const ageSchema = v.number()
  .min(0)          // Non-negative
  .max(120)        // Maximum age
  .integer();      // Must be an integer

console.log('\n=== Age Validation ===');
console.log('Valid age:', ageSchema.validate(25));
console.log('Decimal age:', ageSchema.validate(25.5));
console.log('Negative age:', ageSchema.validate(-5));
console.log('String number:', ageSchema.validate('30')); // Auto-casting

// Price Validation
const priceSchema = v.number()
  .min(0.01)       // Minimum price
  .positive()      // Must be positive
  .custom(value => 
    Number(value) > 1000000 ? 'Price cannot exceed 1 million' : null
  );

console.log('\n=== Price Validation ===');
console.log('Valid price:', priceSchema.validate(99.99));
console.log('Zero price:', priceSchema.validate(0));
console.log('Huge price:', priceSchema.validate(2000000));

// Score Validation (with percentage)
const scoreSchema = v.number()
  .min(0)          // Minimum score
  .max(100)        // Maximum score
  .custom(value => {
    const num = Number(value);
    if (num % 1 !== 0) {
      const decimals = num.toString().split('.')[1];
      if (decimals && decimals.length > 2) {
        return 'Score can have at most 2 decimal places';
      }
    }
    return null;
  });

console.log('\n=== Score Validation ===');
console.log('Valid score:', scoreSchema.validate(85.5));
console.log('Too many decimals:', scoreSchema.validate(85.123));
console.log('Out of range:', scoreSchema.validate(101));
