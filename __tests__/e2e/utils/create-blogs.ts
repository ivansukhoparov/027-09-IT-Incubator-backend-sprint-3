import {app} from "../../../src/app";
import request from "supertest";
import {BlogOutputType} from "../../../src/types/blogs/output";


export const createBlogs = async (numberOfBlogs: number) => {
	const blogs:BlogOutputType[] = [];
	for (let i = 1; i <= numberOfBlogs; i++) {
		const createBlogData = {
			name: "Blog_" + i,
			description: "some valid description",
			websiteUrl: "http://www.validurl.com"
		};
		const res = await request(app).post("/blogs/")
			.auth("admin", "qwerty")
			.send(createBlogData);
		blogs.push(res.body);
	}
	return blogs;
};
