import {WithId} from "mongodb";
import {BlogType, BlogOutputType} from "./output";

export const blogMapper = (blog: WithId<BlogType>): BlogOutputType => {
	return {
		id: blog._id.toString(),
		name: blog.name,
		description: blog.description,
		websiteUrl: blog.websiteUrl,
		createdAt: blog.createdAt,
		isMembership: blog.isMembership
	};

};
