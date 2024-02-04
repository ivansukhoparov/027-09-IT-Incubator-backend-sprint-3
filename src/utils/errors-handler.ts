import {Response} from "express";
import {HTTP_STATUSES} from "./comon";

export const newError = (message: string) => {
    const err = new Error()
    err.message = message;
    return err;
}
export const errorsHandler = (res: Response, err: any) => {
    if (err.message === ERRORS.NOT_FOUND_404) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    } else {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
    }
}
export const ERRORS = {
    NOT_FOUND_404: "not_found",
    BAD_REQUEST_400: "bad_request"
}
