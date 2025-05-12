// src/middleware/validateRequest.ts

import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

// ✅ Generic typing to support all Joi schemas
export const validateRequest =
  (schema: ObjectSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    if (error) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map((detail) => detail.message),
      });
      return;
    }

    next();
  };
