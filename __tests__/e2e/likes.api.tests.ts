import request = require("supertest");
import mongoose from "mongoose";
import {app} from "../../src/app";

import {settings} from "../../src/settings";

import {BlogOutputType} from "../../src/types/blogs/output";
import {UserOutputType} from "../../src/types/users/output";
import {PostOutputType} from "../../src/types/posts/output";
import {createBlogs} from "./utils/create-blogs";
import {createUsers} from "./utils/create-users";
import {createPost} from "./utils/create-posts";
import {HTTP_STATUSES} from "../../src/utils/comon";

// const createUsers = new CreateEntity("users");
// const createBlogs = new CreateEntity("blogs");
// const createPosts = new CreateEntity("posts");
// const createComments = new CreateEntity("comments");

describe("comments", () => {
	const mongoURI = settings.env.mongoUri + "/" + settings.env.mongoDbName;
	beforeAll(async () => {
		await mongoose.connect(mongoURI); // Connecting to the database.
		// Delete add data before tests
		await request(app).delete("/testing/all-data");
		// create createUsers for tests
	});

	afterAll(async () => {
		await mongoose.connection.close(); // Close connection to the database
	});
	beforeEach(async () => {
		await request(app).delete("/testing/all-data");
	});



	it("created arrays with test data should be contains data", async () => {
		const users: UserOutputType[] = await createUsers(1);
		expect(users.length).toBe(1);
		const blogs: BlogOutputType[] = await createBlogs(1);
		expect(blogs.length).toBe(1);
		const posts: PostOutputType[] = await createPost(1, blogs[0].id);
		expect(posts.length).toBe(1);

		// login user
		let res = await request(app).post("/auth/login").send({
			"loginOrEmail": "user_1",
			"password": "qwerty"
		}).expect(HTTP_STATUSES.OK_200);
		expect(res.body).toEqual({"accessToken": expect.any(String)});
		const userAccess = res.body.accessToken;



		console.log("create comment");
		res = await request(app).post("/posts/" + posts[0].id + "/comments")
			.set("Authorization", `Bearer ${userAccess}`)
			.send({"content": "stringstringstringst"})
			.expect(HTTP_STATUSES.CREATED_201);
		let comment = res.body;


		// set like
		res = await request(app).put("/comments/" + comment.id + "/like-status")
			.set("Authorization", `Bearer ${userAccess}`)
			.send({"likeStatus": "Like"})
			.expect(HTTP_STATUSES.NO_CONTENT_204);

		res = await request(app).get("/comments/" + comment.id)
			.set("Authorization", `Bearer ${userAccess}`)
			.expect(HTTP_STATUSES.OK_200);
		comment = res.body;
		expect(res.body).toEqual(  {
			id: expect.any(String),
			content: expect.any(String),
			commentatorInfo: { userId: expect.any(String), userLogin:expect.any(String) },
			createdAt: expect.any(String),
			likesInfo: { likesCount: 1, dislikesCount: 0, myStatus: "Like" }
		});

		// set dislike
		res = await request(app).put("/comments/" + comment.id + "/like-status")
			.set("Authorization", `Bearer ${userAccess}`)
			.send({"likeStatus": "Dislike"})
			.expect(HTTP_STATUSES.NO_CONTENT_204);

		res = await request(app).get("/comments/" + comment.id)
			.set("Authorization", `Bearer ${userAccess}`)
			.expect(HTTP_STATUSES.OK_200);
		expect(res.body).toEqual(  {
			id: expect.any(String),
			content: expect.any(String),
			commentatorInfo: { userId: expect.any(String), userLogin:expect.any(String) },
			createdAt: expect.any(String),
			likesInfo: { likesCount: 0, dislikesCount: 1, myStatus: "Dislike" }
		});


	}, 20000);

});





