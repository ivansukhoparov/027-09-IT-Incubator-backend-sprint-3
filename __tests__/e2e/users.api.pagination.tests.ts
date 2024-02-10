import request = require("supertest");
import mongoose from "mongoose";
import {app} from "../../src/app";
import {settings} from "../../src/settings";
import {CreateEntity} from "./utils/create-users";

const routerName = "/users";

class Results {
	static emptyBlogs = {
		pagesCount: 0,
		page: 1,
		pageSize: 10,
		totalCount: 0,
		items: []
	};
}

const createDifferentUsers = async  ()=>{
	const users_1 = await createUsers.create(2, "ivan");
	const users_2 = await createUsers.create(3, "eva");
	const users_3 = await createUsers.create(2, "alisa");
	const users_4 = await createUsers.create(1);
	return users_1.concat(users_2).concat(users_3).concat(users_4);
};

const createUsers = new CreateEntity("users");

describe(routerName, () => {
	const mongoURI = settings.env.mongoUri + "/" + settings.env.mongoDbName;
	// clear DB before testing
	beforeAll(async () => {
		await mongoose.connect(mongoURI); // Connecting to the database.
		await request(app).delete("/testing/all-data");
	});

	afterAll(async () => {
		await mongoose.connection.close(); // Close connection to the database
	});

	beforeEach(async () => {
		await request(app).delete("/testing/all-data");
	});

	it(" - should be return 200 and empty items array", async () => {
		await request(app).get(routerName).expect(200, Results.emptyBlogs);
	});

	it(" + should create 3 users and return it in right view model", async () => {

		const users = await createUsers.create(3);
		await request(app)
			.get(routerName)
			.expect(200)
			.then(res => {
				expect(res.body).toEqual({
					pagesCount: 1,
					page: 1,
					pageSize: 10,
					totalCount: 3,
					items: users.reverse()
				});
			});
	});

	it(" + should create 4 users and return it in right view model WITH QUERY ?sortDirection=asc", async () => {
		const users = await createUsers.create(4);
		await request(app)
			.get(routerName + "?sortDirection=asc")
			.expect(200)
			.then(res => {
				expect(res.body).toEqual({
					pagesCount: 1,
					page: 1,
					pageSize: 10,
					totalCount: 4,
					items: users
				});
			});
	});

	it(" + should create 10users and return it in right view model WITH QUERY ?sortDirection=asc and pageSize=4", async () => {
		const users = await createUsers.create(10);
		await request(app)
			.get(routerName + "?sortDirection=asc" + "&pageSize=4")
			.expect(200)
			.then(res => {
				expect(res.body).toEqual({
					pagesCount: 3,
					page: 1,
					pageSize: 4,
					totalCount: 10,
					items: users.splice(0, 4)
				});
			});
	});

	it(" + should create 10users and return it in right view model WITH QUERY pageSize=4 and pageNumber=2", async () => {
		const users = await createUsers.create(10);
		await request(app)
			.get(routerName + "?pageSize=4" + "&pageNumber=2")
			.expect(200)
			.then(res => {
				expect(res.body).toEqual({
					pagesCount: 3,
					page: 2,
					pageSize: 4,
					totalCount: 10,
					items: users.reverse().splice(4, 4)
				});
			});
	});

	it(" + should return it in right view model WITH QUERY sortBy by login", async () => {

		const users = await  createDifferentUsers();

		await request(app)
			.get(routerName + "?" + "sortBy=login")
			.expect(200)
			.then(res => {
				expect(res.body).toEqual({
					pagesCount: 1,
					page: 1,
					pageSize: 10,
					totalCount: 8,
					items: users.sort((a, b) => (a.login > b.login ? 1 : -1)).reverse()
				});
			});
	});

	it(" + should return it in right view model WITH QUERY sortBy by email", async () => {

		const users = await  createDifferentUsers();

		await request(app)
			.get(routerName + "?" + "sortBy=email" + "&sortDirection=asc")
			.expect(200)
			.then(res => {
				expect(res.body).toEqual({
					pagesCount: 1,
					page: 1,
					pageSize: 10,
					totalCount: 8,
					items: users.sort((a, b) => (a.email > b.email ? 1 : -1))
				});
			});
	});

	it(" + should return it in right view model WITH QUERY sortBy by id", async () => {

		const users = await  createDifferentUsers();

		await request(app)
			.get(routerName + "?" + "sortBy=id" + "&sortDirection=asc")
			.expect(200)
			.then(res => {
				expect(res.body).toEqual({
					pagesCount: 1,
					page: 1,
					pageSize: 10,
					totalCount: 8,
					items: users.sort((a, b) => (a.id > b.id ? 1 : -1))
				});
			});
	});

	it(" + should return it in right view model WITH QUERY search by Login", async () => {

		const users = await  createDifferentUsers();

		await request(app)
			.get(routerName + "?" + "sortBy=login" + "&sortDirection=asc" + "&searchLoginTerm=va")
			.expect(200)
			.then(res => {
				expect(res.body).toEqual({
					pagesCount: 1,
					page: 1,
					pageSize: 10,
					totalCount: 5,
					items: users.filter((user:any) => user.login.indexOf("va") >= 0).sort((a, b) => (a.login > b.login ? 1 : -1))
				});
			});
	});

	it(" + should return it in right view model WITH QUERY search by email", async () => {

		const users = await  createDifferentUsers();

		await request(app)
			.get(routerName + "?" + "sortBy=email" + "&sortDirection=asc" + "&searchEmailTerm=va")
			.expect(200)
			.then(res => {
				expect(res.body).toEqual({
					pagesCount: 1,
					page: 1,
					pageSize: 10,
					totalCount: 5,
					items: users.filter((user:any) => user.email.indexOf("va") >= 0).sort((a, b) => (a.email > b.email ? 1 : -1))
				});
			});
	});

	it(" + should return it in right view model WITH QUERY search by email and login", async () => {

		const users = await  createDifferentUsers();

		await request(app)
			.get(routerName + "?" + "sortBy=login" + "&sortDirection=asc" + "&searchEmailTerm=va"+"&searchLoginTerm=a")
			.expect(200)
			.then(res => {
				expect(res.body).toEqual({
					pagesCount: 1,
					page: 1,
					pageSize: 10,
					totalCount: 7,
					items: users.filter((user:any) => user.email.indexOf("va") >= 0 || user.login.indexOf("a") >= 0).sort((a, b) => (a.login > b.login ? 1 : -1))
				});
			});
	});
});

//
// const UsersPaginationDataSet = {
// 	test_1: {
// 		numberOfUsers: 10,
// 		query: "",
// 		res: "",
// 		resCode: HTTP_STATUSES.BAD_REQUEST_400
// 	}
// };
