import { useState, useCallback } from 'react';

export interface ValidationRule<T = any> {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
  message?: string;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidationState {
  errors: ValidationError[];
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((field: string, value: any): string | null => {
    const rules = validationRules[field];
    if (!rules) return null;

    // Required validation
    if (rules.required && (value === undefined || value === null || value === '')) {
      return rules.message || `${field} é obrigatório`;
    }

    // Skip other validations if value is empty and not required
    if (!rules.required && (value === undefined || value === null || value === '')) {
      return null;
    }

    // Min/Max validation for numbers
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        return rules.message || `${field} deve ser maior ou igual a ${rules.min}`;
      }
      if (rules.max !== undefined && value > rules.max) {
        return rules.message || `${field} deve ser menor ou igual a ${rules.max}`;
      }
    }

    // MinLength/MaxLength validation for strings
    if (typeof value === 'string') {
      if (rules.minLength !== undefined && value.length < rules.minLength) {
        return rules.message || `${field} deve ter pelo menos ${rules.minLength} caracteres`;
      }
      if (rules.maxLength !== undefined && value.length > rules.maxLength) {
        return rules.message || `${field} deve ter no máximo ${rules.maxLength} caracteres`;
      }
    }

    // Pattern validation
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      return rules.message || `${field} tem formato inválido`;
    }

    // Custom validation
    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  }, [validationRules]);

  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationError[] = [];
    
    Object.keys(validationRules).forEach((field) => {
      const error = validateField(field, values[field as keyof T]);
      if (error) {
        newErrors.push({ field, message: error });
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  }, [values, validateField, validationRules]);

  const validateSingleField = useCallback((field: string, value: any): boolean => {
    const error = validateField(field, value);
    
    setErrors(prev => {
      const filtered = prev.filter(e => e.field !== field);
      return error ? [...filtered, { field, message: error }] : filtered;
    });

    return !error;
  }, [validateField]);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Validate field if it has been touched
    if (touched[field as string]) {
      validateSingleField(field as string, value);
    }
  }, [touched, validateSingleField]);

  const setFieldTouched = useCallback((field: string, isTouched: boolean = true) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }));
    
    if (isTouched) {
      validateSingleField(field, values[field as keyof T]);
    }
  }, [values, validateSingleField]);

  const getFieldError = useCallback((field: string): string | undefined => {
    return errors.find(e => e.field === field)?.message;
  }, [errors]);

  const hasFieldError = useCallback((field: string): boolean => {
    return !!getFieldError(field);
  }, [getFieldError]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors([]);
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setValuesCallback = useCallback((newValues: T) => {
    setValues(newValues);
  }, []);

  const handleSubmit = useCallback(async (onSubmit: (values: T) => Promise<void> | void) => {
    // Mark all fields as touched
    const allTouched = Object.keys(validationRules).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    if (!validateForm()) {
      return false;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, validationRules]);

  const isValid = errors.length === 0;

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    setValue,
    setFieldTouched,
    getFieldError,
    hasFieldError,
    validateForm,
    validateSingleField,
    reset,
    handleSubmit,
    setValues: setValuesCallback,
    setErrors,
    setIsSubmitting
  };
}