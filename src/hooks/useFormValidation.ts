import { useState } from 'react';
import { RegexValidation } from '../utils/RegexValidation';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean | string;
  message?: string;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface FormErrors {
  [key: string]: string;
}

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = (fieldName: string, value: string): string | null => {
    const fieldRules = rules[fieldName];
    if (!fieldRules) return null;

    // Required validation
    if (fieldRules.required && (!value || value.trim() === '')) {
      return fieldRules.message || `${fieldName} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value || value.trim() === '') return null;

    // Min length validation
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      return fieldRules.message || `${fieldName} must be at least ${fieldRules.minLength} characters`;
    }

    // Max length validation
    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      return fieldRules.message || `${fieldName} must be no more than ${fieldRules.maxLength} characters`;
    }

    // Pattern validation
    if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
      return fieldRules.message || `${fieldName} is invalid`;
    }

    // Custom validation
    if (fieldRules.custom) {
      const customResult = fieldRules.custom(value);
      if (customResult !== true) {
        return typeof customResult === 'string' ? customResult : `${fieldName} is invalid`;
      }
    }

    return null;
  };

  const validateForm = (formData: { [key: string]: string }): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(rules).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName] || '');
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const clearErrors = () => setErrors({});
  const clearError = (fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const setFieldError = (fieldName: string, error: string) => {
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  return {
    errors,
    validateField,
    validateForm,
    clearErrors,
    clearError,
    setFieldError,
  };
};

// Predefined validation rule sets
export const commonValidationRules = {
  email: {
    required: true,
    pattern: RegexValidation.emailRegex,
    message: RegexValidation.errorMessages.email,
  },
  password: {
    required: true,
    custom: (value: string) => RegexValidation.validatePassword(value, 'strong') || RegexValidation.errorMessages.password.strong,
  },
  strongPassword: {
    required: true,
    custom: (value: string) => RegexValidation.validatePassword(value, 'strong') || RegexValidation.errorMessages.password.strong,
  },
  basicPassword: {
    required: true,
    custom: (value: string) => RegexValidation.validatePassword(value, 'strong') || RegexValidation.errorMessages.password.strong,
  },
  currentPassword: {
    required: true,
    message: 'Please enter your current password',
  },
  name: {
    required: true,
    custom: (value: string) => RegexValidation.validateName(value) || RegexValidation.errorMessages.name.extended,
  },
  phone: {
    required: true,
    custom: (value: string) => RegexValidation.validatePhone(value) || RegexValidation.errorMessages.phone,
  },
  required: {
    required: true,
    message: 'This field is required',
  },
};
