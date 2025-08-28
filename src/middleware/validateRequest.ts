import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, z } from 'zod';

type SchemaType = AnyZodObject | z.ZodEffects<AnyZodObject>;

export const validateRequest = (schema: SchemaType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if the schema is already a full request schema
      const isFullRequestSchema = 'shape' in schema && 
        'body' in schema.shape && 
        'query' in schema.shape && 
        'params' in schema.shape;

      if (isFullRequestSchema) {
        // If it's a full request schema, validate the entire request
        await (schema as AnyZodObject).parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });
      } else {
        // If it's just a body schema, validate only the body
        await (schema as AnyZodObject).parseAsync(req.body);
      }
      
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors,
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
};
