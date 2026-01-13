export const RegexValidation = {
    emailRegex:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    
    passwordRegex: {
        // Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special character
        strong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        // Minimum 8 characters, at least 1 letter and 1 number
        medium: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        // Minimum 8 characters (any)
        basic: /^.{8,}$/,
    },
    
    phoneRegex: {
        // International format with optional country code
        international: /^\+?[\d\s\-\(\)]{10,}$/,
        // US format: (123) 456-7890 or 123-456-7890 or 1234567890
        us: /^(\+1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
        // General phone number (10-15 digits)
        general: /^[\d\s\-\(\)]{10,15}$/,
    },
    
    nameRegex: {
        // Letters only, spaces allowed, 2-50 characters
        basic: /^[a-zA-Z\s]{2,50}$/,
        // Letters, spaces, hyphens, apostrophes allowed
        extended: /^[a-zA-Z\s\-']{2,50}$/,
    },
    
    // Validation functions
    validateEmail: (email: string): boolean => {
        return RegexValidation.emailRegex.test(email);
    },
    
    validatePassword: (password: string, strength: 'strong' | 'medium' | 'basic' = 'medium'): boolean => {
        return RegexValidation.passwordRegex[strength].test(password);
    },
    
    validatePhone: (phone: string, format: 'international' | 'us' | 'general' = 'general'): boolean => {
        return RegexValidation.phoneRegex[format].test(phone);
    },
    
    validateName: (name: string, format: 'basic' | 'extended' = 'extended'): boolean => {
        return RegexValidation.nameRegex[format].test(name);
    },
    
    // Error messages
    errorMessages: {
        email: 'Please enter a valid email address',
        password: {
            strong: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character',
            medium: 'Password must be at least 8 characters with 1 letter and 1 number',
            basic: 'Password must be at least 8 characters',
        },
        phone: 'Please enter a valid phone number',
        name: {
            basic: 'Name must contain only letters and spaces (2-50 characters)',
            extended: 'Name must contain only letters, spaces, hyphens, and apostrophes (2-50 characters)',
        },
    },
};