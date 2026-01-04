import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);
	if (errors.isEmpty()) return next();
	const extracted = errors.array().map(err => ({ field: err.param, message: err.msg }));
	return res.status(400).json({ errors: extracted });
};
