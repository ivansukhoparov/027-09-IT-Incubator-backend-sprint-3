import request from "supertest";
import mongoose from "mongoose";
import {settings} from "../../src/settings";
import {db} from "../../src/db/mongo/mongo-db";
import { appInit} from "../../src/app";
import {HTTP_STATUSES} from "../../src/utils/comon";
import {UserOutputType} from "../../src/types/users/output";

import {testUserData, ViewModelResponse} from "./data-sets/users-dataset";
import {MongoMemoryServer} from "mongodb-memory-server";
import {testingUserCreate} from "./utils/testing-user-create";

import {runMongoose} from "../../src/db/mongoose/mongoose";
import {MongoClient} from "mongodb";

const routerName = "/users/";

let user: UserOutputType;

describe(routerName, () => {
	const app = appInit();
	beforeAll(async () => {
		const mongoServer = await MongoMemoryServer.create();
		const url = mongoServer.getUri();
		settings.env.mongoUri = url;
		//	db.client = new MongoClient(settings.env.mongoUri);
		await db.run();
		//await runMongoose();
		await request(app).delete("/testing/all-data");
	});
	// beforeEach(async () => {
	// 	await request(app).delete("/testing/all-data");
	// });

	afterAll(async ()=>{
		await request(app).delete("/testing/all-data");

	});


	it("- GET should return empty model view after delete all", async () => {
		await request(app).get(routerName)
			.expect(HTTP_STATUSES.OK_200, ViewModelResponse.emptyBody);
	});

	it(" - POST doesn't create new user with invalid authorization", async () => {
		await request(app).post(routerName)
			.auth("Odmin", "qwerty")
			.send(testUserData.valid.req).expect(HTTP_STATUSES.UNAUTHORIZED_401);
	});

	it(" - POST doesn't create new user with empty data", async () => {
		await testingUserCreate(testUserData.empty, app);
	});

	it(" - POST doesn't create new user with spaces", async () => {
		await testingUserCreate(testUserData.onlySpaces, app);
	});

	it(" - POST doesn't create new user with over length data", async () => {
		await testingUserCreate(testUserData.overLength, app);
	});

	it(" - POST doesn't create new user with less then required length data", async () => {
		await testingUserCreate(testUserData.lessRequireLength, app);
	});

	it(" - POST doesn't create new user with invalid email", async () => {
		await testingUserCreate(testUserData.invalidEmail, app);
	});

	it(" + POST should create user with valid data and return created user", async () => {
		await testingUserCreate(testUserData.valid, app);
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


