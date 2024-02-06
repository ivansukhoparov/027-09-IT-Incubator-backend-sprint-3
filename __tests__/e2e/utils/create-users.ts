import request from "supertest";
import {app} from "../../../src/app";
import {UserOutputType} from "../../../src/types/users/output";

export const createUsers = async (numberOfUsers: number) => {
	const users:UserOutputType[] =[];
	for (let i = 1; i <= numberOfUsers; i++) {
		const createUserData = {
			login: "user_" + i,
			email: "user" + i + "@gmail.com",
			password: "qwerty"
		};
		const res = await request(app).post("/users/").auth("admin", "qwerty").send(createUserData);
		users.push(res.body);
	}
	return users;
};
