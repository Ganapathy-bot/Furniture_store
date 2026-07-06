import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { sendError } from '../utils/apiResponse';

export function validate(schema: Joi.ObjectSchema, source: 'body' | 'query' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      sendError(
        res,
        400,
        'VALIDATION_ERROR',
        'Validation failed',
        error.details.map((d) => ({ field: d.path.join('.'), message: d.message }))
      );
      return;
    }

    req[source] = value;
    next();
  };
}