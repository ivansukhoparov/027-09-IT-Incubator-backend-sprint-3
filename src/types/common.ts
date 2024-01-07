import {Request} from "express";

export type RequestWithParams<P> = Request<P, {}, {}, {}>
export type RequestWithBody<B> = Request<{}, {}, B, {}>
export type RequestWithBodyAndParams<P, B> = Request<P, {}, B, {}>
export type RequestWithSearchTerms<T> = Request<{}, {}, {}, T>
export type RequestWithSearchTermsAndParams<P, T> = Request<P, {}, {}, T>

export type Params = {
    id: string
}

export type ErrorType = {
    errorsMessages: ErrorsMessageType[]
}
export type ErrorsMessageType = {
    field: string
    message: string
}

