import { NextFunction, Request, Response } from "express"
import { AppError } from './../error/appErrors';
import { Prisma } from "@prisma/client";


export function globalError(err: any, req: Request, res: Response, next: NextFunction) {

    const requestInfo = {
        method: req.method,
        path: req.originalUrl,
        time: new Date().toLocaleString()
        // params: req.params,
        // query: req.query,
        // body: req.body

    }

    if (res.headersSent) {
        return next(err);
    }

    let status = 500;
    let message = "Internal Server Error";


    //Erro from AppError class
    if (err instanceof AppError) {
        status = err.statusCode;
        message = err.message
    }

    //prisma client validation error
    else if (err instanceof Prisma.PrismaClientValidationError) {
        status = 400;
        message = "You have provided incorrect fieled type or missing field"
    }

    // primsa client unknown request error
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
            status = 400;
            message = "The specific record you are trying to access or modify does not exist."
        } else if (err.code === "P2002") {
            status = 400;
            message = "Unique constraint failed"
        } else if (err.code === "P2003") {
            status = 400;
            message = "Foreign key constraint failed"
        }
    }

    //Prisma Client Unknown Request Error
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        status = 500;
        message = "Error occurred during query execution"
    }

    console.log("Error ", err)
    res.status(status).json({
        success: false,
        message,
        requestInfo
    });
}