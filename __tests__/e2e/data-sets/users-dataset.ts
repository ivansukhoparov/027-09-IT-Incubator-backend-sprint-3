import {HTTP_STATUSES} from "../../../src/utils/comon";

export class ViewModelResponse {
	static emptyBody = {
		pagesCount: 0,
		page: 1,
		pageSize: 10,
		totalCount: 0,
		items: []
	};
}

function errorsResponse(fields: string[]) {
	const response: { errorsMessages: Object[] } = {errorsMessages: []};
	fields.forEach(f => {
		response.errorsMessages.push({message: "Invalid value", field: f});
	});
	return response;
}

export const testUserData = {
	onlySpaces: {
		req: {
			login: "        ",
			email: "     ",
			password: "       "
		},
		res: errorsResponse(["login", "email", "password"]),
		resCode: HTTP_STATUSES.BAD_REQUEST_400
	},
	empty: {
		req: {
			login: "",
			email: "",
			password: ""
		},
		res: errorsResponse(["login", "email", "password"]),
		resCode: HTTP_STATUSES.BAD_REQUEST_400
	},
	invalidEmail: {
		req: {
			login: "login",
			email: "qwe",
			password: "qwerty"
		},
		res: errorsResponse(["email"]),
		resCode: HTTP_STATUSES.BAD_REQUEST_400
	},
	lessRequireLength: {
		req: {
			login: "Lo",
			email: "qwe123@gmail.com",
			password: "pas"
		},
		res: errorsResponse(["login", "password"]),
		resCode: HTTP_STATUSES.BAD_REQUEST_400
	},
	overLength: {
		req: {
			login: "login_over_10",
			email: "qwe123@gmail.com",
			password: "password_over_20_characters"
		},
		res: errorsResponse(["login", "password"]),
		resCode: HTTP_STATUSES.BAD_REQUEST_400
	},
	valid: {
		req: {
			login: "login",
			email: "qwe123@gmail.com",
			password: "qwerty"
		},
		res: {
			id: expect.any(String),
			login: expect.any(String),
			email: expect.any(String),
			createdAt: expect.any(String)
		},
		resCode: HTTP_STATUSES.CREATED_201
	}
};



