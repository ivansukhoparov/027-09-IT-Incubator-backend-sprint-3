import dotenv from "dotenv";

dotenv.config();

export const HTTP_STATUSES = {
	OK_200: 200,
	CREATED_201: 201,
	NO_CONTENT_204: 204,

	BAD_REQUEST_400: 400,
	NOT_FOUND_404: 404,
	UNAUTHORIZED_401: 401,
	FORBIDDEN_403:403,
	TOO_MANY_REQUESTS_429:429,

	SERVER_ERROR_500: 500
};


export const AUTH_METHODS={
	base: "Basic",
	bearer: "Bearer"
};
