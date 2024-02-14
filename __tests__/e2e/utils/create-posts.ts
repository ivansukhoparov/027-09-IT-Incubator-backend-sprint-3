import request from "supertest";
import {app} from "../../../src/app";
import {PostOutputType} from "../../../src/types/posts/output";

export const createPost = async (numberOfBlogs: number, blogId:string) => {

	const posts :PostOutputType[]=[];
	for (let i = 1; i <= numberOfBlogs; i++) {
		const createPostData = {
			title: "Some_title",
			shortDescription: "a_very_short_valid_description",
			content: "some_valid_content",
			blogId: blogId
		};
		const res = await request(app)
			.post("/posts/")
			.auth("admin", "qwerty")
			.send(createPostData	);

		posts.push(res.body);
	}
	return posts;
};

export const createPostWithData = async (createPostData:any) => {

	const res = await request(app).post("posts")
		.auth("admin", "qwerty")
		.send(createPostData	);

	return res.body;
};
