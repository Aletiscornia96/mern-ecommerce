import { validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Formateao la salida para mostrat mas facil en el front
    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      errors: formattedErrors,
    });
  }

  next();
};