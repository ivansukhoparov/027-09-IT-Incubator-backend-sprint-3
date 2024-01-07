import dotenv from "dotenv";

dotenv.config();

//export const mongoUri = process.env.MONGO_URL!

// localDB
export const mongoUri = "mongodb://0.0.0.0:27017"
export const emailLogin =process.env.EMAIL_LOGIN!
export const emailPassword = process.env.EMAIL_PASSWORD!
export const port: number = 5001;

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
    UNAUTHORIZED_401: 401,
    FORBIDDEN_403:403,

    SERVER_ERROR_500: 500
}


export const AUTH_METHODS={
    base: "Basic",
    bearer: "Bearer"
}
