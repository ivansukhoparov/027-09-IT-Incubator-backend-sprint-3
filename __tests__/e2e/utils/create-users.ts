import request from "supertest";
import {app} from "../../../src/app";

export const createUsers = async (numberOfUsers: number) => {
	for (let i = 1; i <= numberOfUsers; i++) {
		const createUserData = {
			login: "user_" + i,
			email: "user" + i + "@gmail.com",
			password: "qwerty"
		};
		await request(app).post("/users/").auth("admin", "qwerty").send(createUserData);
	}
};
