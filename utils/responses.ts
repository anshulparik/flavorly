import type { Response } from "express";

export const successResponse = (res: Response, status: number, data: any, message: string = "Success") => {
    return res.status(status).json({
        success: true,
        message,
        data
    });
}

export const errorResponse = (res: Response, status: number, error: string) => {
    return res.status(status).json({
        success: false,
        error
    });
}