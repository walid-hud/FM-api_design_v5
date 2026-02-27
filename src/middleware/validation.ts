import { log } from 'console'
import type { Request, Response, NextFunction } from 'express'
import { type ZodSchema, ZodError } from 'zod'

const validateBody = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const {data, error } = schema.safeParse(req.body)
    if (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'validation error',
          details: error.issues.map((e) => ({
            fields: e.path.join('.'),
            message: e.message,
          })),
        })
        return
      }
      else{
        next(error)
        return
      }
    }
    req.body = data // we re-assign so that schema specific rules are preserved
    next()
  }
}

const validateParams = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const {data, error } = schema.safeParse(req.params)
    if (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'invalid params',
          details: error.issues.map((e) => ({
            fields: e.path.join('.'),
            message: e.message,
          })),
        })
        return
      }
      else{
        next(error)
        return
      }
    }
    next()
  }
}


const validateQuery = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const {data, error } = schema.safeParse(req.query)
    if (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'invalid query',
          details: error.issues.map((e) => ({
            fields: e.path.join('.'),
            message: e.message,
          })),
        })
        return
      }
      else{
        next(error)
        return
      }
    }
    next()
  }
}




export {validateBody , validateParams  ,  validateQuery}