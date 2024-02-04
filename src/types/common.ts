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

export type QueryRequestType = {
    searchLoginTerm?: string | null
    searchEmailTerm?: string | null
    searchNameTerm?: string | null
    sortBy?: string
    sortDirection?: "asc" | "desc"
    pageNumber?: number
    pageSize?: number
}

export type QuerySortType = {
    sortBy: string
    sortDirection: "asc" | "desc"
    pageNumber: number
    pageSize: number
}

export type QuerySearchType = {
    searchLoginTerm?: string | null
    searchEmailTerm?: string | null
    searchNameTerm?: string | null
}
