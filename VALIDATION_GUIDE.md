# Validation System Guide

This guide explains how to use the centralized validation system implemented across the React Native app.

## Overview

The validation system consists of:
1. **RegexValidation** - Centralized regex patterns and validation functions
2. **useFormValidation** - Custom hook for form validation
3. **commonValidationRules** - Predefined validation rule sets

## Files

- `src/utils/RegexValidation.ts` - Core validation utilities
- `src/hooks/useFormValidation.ts` - Form validation hook
- `VALIDATION_GUIDE.md` - This documentation

## RegexValidation Utility

### Available Validations

#### Email Validation
```typescript
RegexValidation.validateEmail('user@example.com') // boolean
```

#### Password Validation
```typescript
// Strong: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
RegexValidation.validatePassword(password, 'strong')

// Medium: 6+ chars, 1 letter, 1 number
RegexValidation.validatePassword(password, 'medium')

// Basic: 6+ chars (any)
RegexValidation.validatePassword(password, 'basic')
```

#### Phone Validation
```typescript
// International format
RegexValidation.validatePhone(phone, 'international')

// US format
RegexValidation.validatePhone(phone, 'us')

// General format (10-15 digits)
RegexValidation.validatePhone(phone, 'general')
```

#### Name Validation
```typescript
// Letters and spaces only
RegexValidation.validateName(name, 'basic')

// Letters, spaces, hyphens, apostrophes
RegexValidation.validateName(name, 'extended')
```

### Error Messages
```typescript
RegexValidation.errorMessages.email
RegexValidation.errorMessages.password.medium
RegexValidation.errorMessages.phone
RegexValidation.errorMessages.name.extended
```

## useFormValidation Hook

### Basic Usage
```typescript
import { useFormValidation, commonValidationRules } from '../../hooks/useFormValidation';

const validationRules = {
  email: commonValidationRules.email,
  password: commonValidationRules.mediumPassword,
};

const { errors, validateForm, setFieldError, clearErrors } = useFormValidation(validationRules);
```

### Custom Rules
```typescript
const customRules = {
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: 'Username must be 3-20 characters (letters, numbers, underscore)',
  },
  customField: {
    required: false,
    custom: (value) => {
      if (value && value.startsWith('special')) {
        return true;
      }
      return 'Value must start with "special"';
    },
  },
};
```

### Validation Methods

#### validateForm
```typescript
const formData = { email: 'test@example.com', password: 'password123' };
const isValid = validateForm(formData); // boolean
// errors object is automatically populated
```

#### validateField
```typescript
const error = validateField('email', 'test@example.com'); // string | null
```

#### Error Management
```typescript
clearErrors(); // Clear all errors
clearError('email'); // Clear specific error
setFieldError('email', 'Custom error message');
```

## Implementation Examples

### LoginScreen
```typescript
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validationRules = {
    email: commonValidationRules.email,
    password: commonValidationRules.basicPassword,
  };

  const { errors, validateForm, clearErrors } = useFormValidation(validationRules);

  const handleLogin = () => {
    clearErrors();
    
    const formData = { email, password };
    if (validateForm(formData)) {
      // Proceed with login
    }
  };

  return (
    <View>
      <TextInputWithLabel
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        // ... other props
      />
      <PasswordInput
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        // ... other props
      />
    </View>
  );
};
```

### RegisterScreen
```typescript
const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validationRules = {
    name: commonValidationRules.name,
    email: commonValidationRules.email,
    phone: commonValidationRules.phone,
    password: commonValidationRules.mediumPassword,
    confirmPassword: {
      required: true,
      custom: (value) => value === password || 'Passwords do not match',
    },
  };

  const { errors, validateForm } = useFormValidation(validationRules);

  const handleRegister = () => {
    const formData = { name, email, phone, password, confirmPassword };
    if (validateForm(formData)) {
      // Proceed with registration
    }
  };
};
```

### EditProfileModal
```typescript
const EditProfileModal = ({ editMode }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const getValidationRules = () => {
    const baseRules = {
      currentPassword: commonValidationRules.basicPassword,
    };

    if (editMode === 'email') {
      return { ...baseRules, email: commonValidationRules.email };
    }
    if (editMode === 'phone') {
      return { ...baseRules, phone: commonValidationRules.phone };
    }
    if (editMode === 'password') {
      return {
        ...baseRules,
        newPassword: commonValidationRules.mediumPassword,
        confirmPassword: {
          required: true,
          custom: (value) => value === newPassword || 'Passwords do not match',
        },
      };
    }
    return baseRules;
  };

  const { errors, validateForm } = useFormValidation(getValidationRules());
};
```

## Best Practices

### 1. Use Common Rules When Possible
```typescript
// Good
email: commonValidationRules.email,
password: commonValidationRules.mediumPassword,

// Avoid duplicating
email: {
  required: true,
  pattern: RegexValidation.emailRegex,
  message: RegexValidation.errorMessages.email,
},
```

### 2. Clear Errors on Input Change
```typescript
<TextInputWithLabel
  onChangeText={(value) => {
    setEmail(value);
    clearError('email'); // Clear error when user starts typing
  }}
  error={errors.email}
/>
```

### 3. Validate on Blur
```typescript
<TextInputWithLabel
  onBlur={() => {
    const error = validateField('email', email);
    if (error) setFieldError('email', error);
  }}
  error={errors.email}
/>
```

### 4. Handle API Validation Errors
```typescript
try {
  await apiCall(data);
} catch (error) {
  if (error.field === 'email') {
    setFieldError('email', error.message);
  }
}
```

### 5. Conditional Validation
```typescript
const getRules = () => {
  const rules = {
    email: commonValidationRules.email,
  };

  if (userType === 'premium') {
    rules.subscriptionCode = {
      required: true,
      pattern: /^[A-Z0-9]{8}$/,
      message: 'Invalid subscription code',
    };
  }

  return rules;
};
```

## Migration Guide

### From Manual Validation
```typescript
// Before
if (!email.trim()) {
  setEmailError('Please enter your email');
} else if (!/\S+@\S+\.\S+/.test(email)) {
  setEmailError('Please enter a valid email');
}

// After
email: commonValidationRules.email,
// Then use validateForm() or validateField()
```

### From Hardcoded Regex
```typescript
// Before
if (!/^\d{10}$/.test(phone)) {
  setPhoneError('Please enter a valid 10-digit mobile number');
}

// After
phone: commonValidationRules.phone,
// Error message is automatically provided
```

## Testing

The validation system is designed to be easily testable:

```typescript
// Test validation functions
expect(RegexValidation.validateEmail('test@example.com')).toBe(true);
expect(RegexValidation.validateEmail('invalid')).toBe(false);

// Test hook behavior
const { result } = renderHook(() => useFormValidation(rules));
act(() => {
  result.current.validateForm({ email: 'invalid' });
});
expect(result.current.errors.email).toBeDefined();
```

## Future Enhancements

1. **Async Validation**: Add support for async validation (e.g., username availability)
2. **Field Dependencies**: Better support for fields that depend on other fields
3. **Internationalization**: Support for multiple error message languages
4. **Debounced Validation**: Add debounced validation for better UX
5. **Schema Validation**: Integration with schema validation libraries like Zod
