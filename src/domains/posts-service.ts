import {BlogsRepository} from "../repositories/blogs-repository";
import {PostType} from "../types/posts/output";
import {PostsRepository} from "../repositories/posts-repository";
import {postMapper} from "../types/posts/mapper";
import {CreatePostDto} from "../types/posts/input";

export class PostsService {
    static async createNewPost(createData: CreatePostDto, id?: string,) {
        const blogId = id || createData.blogId
        const createdAt = new Date();
        const blog = await BlogsRepository.getBlogById(blogId)

        if (!blog) return null

        const newPostData: PostType = {
            title: createData.title,
            shortDescription: createData.shortDescription,
            content: createData.content,
            blogId: blogId,
            blogName: blog.name,
            createdAt: createdAt.toISOString()
        }

        const newPostId = await PostsRepository.createPost(newPostData);

        if (!newPostId) return null

        const newPost = await PostsRepository.getPostById(newPostId);

        if (!newPost) return null

        return postMapper(newPost)
    }
}
