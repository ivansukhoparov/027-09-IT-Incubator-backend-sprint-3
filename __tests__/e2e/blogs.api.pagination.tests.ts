import request = require("supertest");
import mongoose from "mongoose";
import {app} from "../../src/app";
import {settings} from "../../src/settings";
import {CreateEntity} from "./utils/create-users";

const routerName = "/blogs/";
class Results {
	static emptyBlogs = {
		pagesCount: 0,
		page: 1,
		pageSize: 10,
		totalCount: 0,
		items: []
	};
}

const createUsers = new CreateEntity("users");

describe(routerName, () => {
	const mongoURI = settings.env.mongoUri+"/"+settings.env.mongoDbName;
	// clear DB before testing
	beforeAll(async () => {
		await mongoose.connect(mongoURI); // Connecting to the database.
		await request(app).delete("/testing/all-data");
	});

	afterAll(async ()=>{
		await mongoose.connection.close(); // Close connection to the database
	});

	beforeEach(async () => {
		await request(app).delete("/testing/all-data");
	});

	it(" - should be return 200 and empty items array", async () => {
		await request(app).get(routerName).expect(200, Results.emptyBlogs);
	});

	it(" - should create 10 users", async ()=>{
		await createUsers.create(10);
		await request(app)
			.get(routerName)
			.expect(200)
			.then(res => {
				expect(res.body.items.length).toBe(10);
				console.log(res.body);
			});
	});



});
