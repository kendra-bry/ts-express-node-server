import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error('Error caught by custom error handler:', err.message);

  res.status(500).json({ error: err.message });
};
