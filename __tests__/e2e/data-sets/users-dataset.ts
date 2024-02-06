export class createUserData {

	static valid = {
		data: {
			login: "login",
			email: "qwe123@gmail.com",
			password: "qwerty"
		},
		response: {
			pagesCount: 0,
			page: 1,
			pageSize: 10,
			totalCount: 0,
			items: []
		}
	};

	static overLength = {
		data: {
			login: "login_over_10",
			email: "qwe123@gmail.com",
			password: "password_over_20_characters"
		},
		errors: this._errorsResponse(["login", "password"])
	};

	static lessRequireLength = {
		data: {
			login: "Lo",
			email: "qwe123@gmail.com",
			password: "pas"
		},
		errors: this._errorsResponse(["login", "password"])
	};

	static invalidEmail = {
		data: {
			login: "login",
			email: "qwe",
			password: "qwerty"
		},
		errors: this._errorsResponse(["email"])
	};

	static empty = {
		data: {
			login: "",
			email: "",
			password: ""
		},
		errors: this._errorsResponse(["login", "email", "password"])
	};

	static onlySpaces = {
		data: {
			login: "     ",
			email: "     ",
			password: "       "
		},
		errors: this._errorsResponse(["login", "email", "password"])
	};

	static _errorsResponse(fields: string[]) {
		const response: { errorsMessages: Object[] } = {errorsMessages: []};
		fields.forEach(f => {
			response.errorsMessages.push({message: "Invalid value", field: f});
		});
		return response;
	}

}

export class ViewModelResponse {
	static emptyBody = {
		pagesCount: 0,
		page: 1,
		pageSize: 10,
		totalCount: 0,
		items: []
	};
}
