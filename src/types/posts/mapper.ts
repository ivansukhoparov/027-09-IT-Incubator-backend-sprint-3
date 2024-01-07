import {WithId} from "mongodb";
import {PostOutputType, PostType} from "./output";

export const postMapper = (post: WithId<PostType>): PostOutputType => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }

}
