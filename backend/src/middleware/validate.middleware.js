/**
 * Validation Middleware
 * Express-validator integration
 */

const { validationResult } = require('express-validator');

/**
 * Process validation result
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      return next();
    }

    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: formattedErrors
    });
  };
};

/**
 * Sanitize and validate MongoDB ObjectId
 */
const isValidObjectId = (value) => {
  return /^[0-9a-fA-F]{24}$/.test(value);
};

/**
 * Custom validators
 */
const customValidators = {
  isThaiPhone: (value) => {
    if (!value) return true;
    return /^(\+66|66|0)\d{9}$/.test(value.replace(/\s/g, ''));
  },
  
  isStrongPassword: (value) => {
    return value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value);
  },

  isSafeString: (value) => {
    if (!value) return true;
    return !/[<>{}]/.test(value);
  }
};

module.exports = { validate, isValidObjectId, customValidators };
