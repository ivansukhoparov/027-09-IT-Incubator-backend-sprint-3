import {app} from "../../../src/app";
import request from "supertest";


export const createBlogs = async (numberOfBlogs: number) => {

	for (let i = 1; i <= numberOfBlogs; i++) {
		const createBlogData = {
			name: "Blog_" + i,
			description: "some valid description",
			websiteUrl: "http://www.validurl.com"
		};
		await request(app).post("/blogs/")
			.auth("admin", "qwerty")
			.send(createBlogData);
	}
};
