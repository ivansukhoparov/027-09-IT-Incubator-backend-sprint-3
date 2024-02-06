import request from "supertest";
import mongoose from "mongoose";
import {app} from "../../src/app";
import {HTTP_STATUSES} from "../../src/utils/comon";
import {UserOutputType} from "../../src/types/users/output";
import {settings} from "../../src/settings";
import {createUserData, ViewModelResponse} from "./data-sets/users-dataset";

const routerName = "/users/";

let user: UserOutputType;

describe(routerName, () => {
	const mongoURI = settings.env.mongoUri+"/"+settings.env.mongoDbName;
	beforeAll(async () => {
		await mongoose.connect(mongoURI); // Connecting to the database.
		await request(app).delete("/testing/all-data");
	});

	afterAll(async ()=>{
		await mongoose.connection.close(); // Close connection to the database
	});


	it("- should return empty model view after delete all", async () => {
		await request(app).get(routerName)
			.expect(HTTP_STATUSES.OK_200, ViewModelResponse.emptyBody);
	});

	it(" - POST doesn't create new user with invalid authorization", async () => {
		await request(app).post(routerName)
			.auth("Odmin", "qwerty")
			.send(createUserData.valid.data).expect(HTTP_STATUSES.UNAUTHORIZED_401);
	});

	it(" - POST doesn't create new user with empty data", async () => {
		await request(app).post(routerName)
			.auth("admin", "qwerty")
			.send(createUserData.empty.data)
			.expect(HTTP_STATUSES.BAD_REQUEST_400, createUserData.empty.errors);
	});
	it(" - POST doesn't create new user with spaces", async () => {
		await request(app).post(routerName).auth("admin", "qwerty")
			.send(createUserData.onlySpaces.data)
			.expect(HTTP_STATUSES.BAD_REQUEST_400, createUserData.onlySpaces.errors);
	});
	it(" - POST doesn't create new user with over length data", async () => {
		await request(app).post(routerName)
			.auth("admin", "qwerty")
			.send(createUserData.overLength.data)
			.expect(HTTP_STATUSES.BAD_REQUEST_400, createUserData.overLength.errors);
	});
	it(" - POST doesn't create new user with less then required length data", async () => {
		await request(app).post(routerName)
			.auth("admin", "qwerty")
			.send(createUserData.lessRequireLength.data)
			.expect(HTTP_STATUSES.BAD_REQUEST_400, createUserData.lessRequireLength.errors);
	});
	it(" - POST doesn't create new user with invalid email", async () => {
		await request(app).post(routerName).auth("admin", "qwerty")
			.send(createUserData.invalidEmail.data)
			.expect(HTTP_STATUSES.BAD_REQUEST_400, createUserData.invalidEmail.errors);
	});
	it(" + POST should create user with valid data and return created user", async () => {
		// const res = await request(app).post(routerName).auth("admin", "qwerty")
		// 	.send(createUserData.valid.data)
		// 	.expect(HTTP_STATUSES.CREATED_201);
		// user = res.body;
	});

	it(" + GET should return all user ", async () => {
		await request(app).get(routerName)
			.expect(HTTP_STATUSES.OK_200);
	});

	it("- DELETE doesnt delete user with invalid id", async () => {
		await request(app).delete(routerName + "-150").auth("admin", "qwerty").expect(HTTP_STATUSES.NOT_FOUND_404);
		const allUsers = await request(app).get(routerName).expect(HTTP_STATUSES.OK_200);
		expect(allUsers.body.items.length).toBe(1);
	});

	it("- DELETE doesnt delete user with invalid auth", async () => {
		await request(app).delete(routerName +user.id).auth("Odmin", "qwerty").expect(HTTP_STATUSES.UNAUTHORIZED_401);
		const allUsers = await request(app).get(routerName).expect(HTTP_STATUSES.OK_200);
		expect(allUsers.body.items.length).toBe(1);
	});

	it ("should be auth with valid login and password", async ()=>{
		const res = await request(app).post("/auth/login").send({
			"loginOrEmail":"login",
			"password":"qwerty"
		}).expect(HTTP_STATUSES.OK_200);
		expect(res.body).toEqual({
			"accessToken": res.body.accessToken
		});
	});

	it ("doesn't auth with invalid login and password", async ()=>{
		await request(app).post("/auth/login").send({
			"loginOrEmail":"logisn",
			"password":"qwertsy"
		}).expect(HTTP_STATUSES.UNAUTHORIZED_401);
	});

	it("- DELETE should delete user by id", async () => {
		await request(app).delete(routerName +user.id).auth("admin", "qwerty").expect(HTTP_STATUSES.NO_CONTENT_204);
		const allUsers = await request(app).get(routerName).expect(HTTP_STATUSES.OK_200);
		expect(allUsers.body.items.length).toBe(0);
	});
});


