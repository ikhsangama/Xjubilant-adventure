import {NextFunction, Request, Response} from "express";
import {QueryFailedError} from "typeorm";
import {logger} from "../utilities/logger";

export function errHandler(err: any, req: Request, res: Response, next: NextFunction) {
    logger.info(err);

    if ((err instanceof QueryFailedError)) {
        logger.info({ err }, 'Query Failed Error');
        return res.status(400).json({
            error_code: 400,
            message: err.driverError.detail,
        });
    }

    // custom error handling
    if(err.name){
        let errors = []
        let statusCode = 500

        logger.info(err.name);

        switch (err.name) {
        case 'Invalid Input':
            errors = err.errors.map((error:string) => error)
            statusCode = 400
            break
        default:
            errors.push(err.msg || "internal server error")
            statusCode = err.statusCode || 500
        }

        return res.status(statusCode).json({
            error_code: statusCode,
            errors
        })
    }
}
