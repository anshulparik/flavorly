import type { ZodObject } from "zod";
import type { Request, Response, NextFunction } from "express";


export const validate = (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ success: false, error: result.error.issues })
    }

    next();
}


