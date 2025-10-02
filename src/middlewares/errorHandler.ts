import type { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/CustomError.js";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if(err instanceof CustomError) {
        return res.status(err.statusCode).send({
            type: err.type,
            errors: err.serializeErrors()
        })
    }
    console.error(err)
    res.status(500).send({
        type: 'InternalServerError',
        errors: [{message: 'Algo inesperado ocorreu.'}]
    })
}


