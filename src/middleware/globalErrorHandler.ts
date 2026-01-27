import { NextFunction, Request, Response } from "express"
import { AppError } from './../error/appErrors';

export function globalError(err: any, req: Request, res: Response, next: NextFunction) {

    const requestInfo = {
        method: req.method,
        path: req.originalUrl,
        params: req.params,
        query: req.query,
        body: req.body
    }

    if (res.headersSent) {
        return next(err);
    }

    let status = 500;
    let message = "Internal Server Error";


    if (err instanceof AppError) {
        status = err.statusCode;
        message = err.message
    }

    console.log("Error ", err)
    res.status(status).json({
        success: false,
        message,
        requestInfo
    });
}