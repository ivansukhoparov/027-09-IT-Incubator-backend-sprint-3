import {BlogsRepository} from "../repositories/blogs-repository";
import {PostDtoType} from "../types/posts/output";
import {PostsRepository} from "../repositories/posts-repository";
import {postMapper} from "../types/posts/mapper";
import {PostReqBodyCreateType} from "../types/posts/input";
import {newError} from "../utils/create-error";

export class PostsService {
    private postRepository: PostsRepository;
    private blogRepository: BlogsRepository;
    constructor() {
        this.postRepository = new PostsRepository();
        this.blogRepository = new BlogsRepository();
    }

    async createNewPost(createData: PostReqBodyCreateType, id?: string) {
        const blogId = id ? id : createData.blogId
        const createdAt = new Date();

        const blog = await this.blogRepository.getBlogById(blogId)
        if (!blog) throw new Error("not_found");

        const newPostData: PostDtoType = {
            title: createData.title,
            shortDescription: createData.shortDescription,
            content: createData.content,
            blogId: blogId,
            blogName: blog.name,
            createdAt: createdAt.toISOString()
        }

        const newPostId = await this.postRepository.createPost(newPostData);

        const newPost = await this.postRepository.getPostById(newPostId);
        if (!newPost) throw new Error("not_found");

        return postMapper(newPost)
    }

    async updatePost(updateData: PostReqBodyCreateType, id?: string) {
        const blogId = id ? id : createData.blogId
        const createdAt = new Date();

        const blog = await this.blogRepository.getBlogById(blogId)
        if (!blog) throw new Error("not_found");

        const newPostData: PostDtoType = {
            title: createData.title,
            shortDescription: createData.shortDescription,
            content: createData.content,
            blogId: blogId,
            blogName: blog.name,
            createdAt: createdAt.toISOString()
        }

        const newPostId = await this.postRepository.createPost(newPostData);

        const newPost = await this.postRepository.getPostById(newPostId);
        if (!newPost) throw new Error("not_found");

        return postMapper(newPost)
    }
}
