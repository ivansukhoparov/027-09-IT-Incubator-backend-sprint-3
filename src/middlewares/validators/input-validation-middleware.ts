import {validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";

import {HTTP_STATUSES} from "../../utils/comon";


export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {

	const result = validationResult(req).array({ onlyFirstError: true });
	const errorsMessages = result.map(error => {
		switch (error.type) {
		case "field":
			return {
				message: error.msg,
				field: error.path
			};
		default:
			return {
				message: error.msg,
				field: "unknown error"
			};
		}
	});
	const errors = {errorsMessages:errorsMessages};

	if (errors.errorsMessages.length>0) {
		res.status(HTTP_STATUSES.BAD_REQUEST_400).json(errors);
	} else {
		next();
	}
};



