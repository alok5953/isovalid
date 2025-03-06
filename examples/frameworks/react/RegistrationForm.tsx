import React, { useState, FormEvent } from 'react';
import { v } from '@alok5953/isovalid';

// Define validation schemas
const registrationSchema = {
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
  password: v.string()
    .min(8)
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/)
    .custom(value => 
      String(value).toLowerCase().includes('password')
        ? 'Password cannot contain the word "password"'
        : null
    ),
  age: v.number()
    .integer()
    .min(18)
    .max(120)
};

// TypeScript interface matching our schema
interface RegistrationData {
  username: string;
  email: string;
  password: string;
  age: string; // Using string as form inputs return strings
}

interface ValidationErrors {
  [key: string]: string[];
}

export const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationData>({
    username: '',
    email: '',
    password: '',
    age: ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitStatus, setSubmitStatus] = useState<string>('');

  const validateField = (field: keyof typeof registrationSchema, value: any) => {
    const schema = registrationSchema[field];
    const result = schema.validate(value);
    return result.valid ? null : result.errors[0].message;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const error = validateField(name as keyof typeof registrationSchema, value);
    setErrors(prev => ({
      ...prev,
      [name]: error ? [error] : []
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: ValidationErrors = {};

    // Validate all fields
    Object.entries(registrationSchema).forEach(([field, schema]) => {
      const value = formData[field as keyof RegistrationData];
      const result = schema.validate(field === 'age' ? Number(value) : value);
      if (!result.valid) {
        newErrors[field] = result.errors.map(e => e.message);
      }
    });

    if (Object.keys(newErrors).length === 0) {
      // Form is valid, simulate API call
      try {
        setSubmitStatus('Submitting...');
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSubmitStatus('Registration successful!');
        // Reset form
        setFormData({
          username: '',
          email: '',
          password: '',
          age: ''
        });
      } catch (error) {
        setSubmitStatus('Registration failed. Please try again.');
      }
    } else {
      setErrors(newErrors);
      setSubmitStatus('Please fix the errors and try again.');
    }
  };

  return (
    <div className="registration-form">
      <h2>Registration Form</h2>
      {submitStatus && (
        <div className={`status ${submitStatus.includes('successful') ? 'success' : 'error'}`}>
          {submitStatus}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username?.length ? 'error' : ''}
          />
          {errors.username?.map((error, index) => (
            <div key={index} className="error-message">{error}</div>
          ))}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email?.length ? 'error' : ''}
          />
          {errors.email?.map((error, index) => (
            <div key={index} className="error-message">{error}</div>
          ))}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password?.length ? 'error' : ''}
          />
          {errors.password?.map((error, index) => (
            <div key={index} className="error-message">{error}</div>
          ))}
        </div>

        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className={errors.age?.length ? 'error' : ''}
          />
          {errors.age?.map((error, index) => (
            <div key={index} className="error-message">{error}</div>
          ))}
        </div>

        <button type="submit">Register</button>
      </form>

      <style jsx>{`
        .registration-form {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        label {
          display: block;
          margin-bottom: 5px;
        }

        input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        input.error {
          border-color: #ff4444;
        }

        .error-message {
          color: #ff4444;
          font-size: 0.8em;
          margin-top: 5px;
        }

        button {
          background-color: #4CAF50;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        button:hover {
          background-color: #45a049;
        }

        .status {
          padding: 10px;
          margin-bottom: 20px;
          border-radius: 4px;
        }

        .status.success {
          background-color: #dff0d8;
          color: #3c763d;
        }

        .status.error {
          background-color: #f2dede;
          color: #a94442;
        }
      `}</style>
    </div>
  );
};
