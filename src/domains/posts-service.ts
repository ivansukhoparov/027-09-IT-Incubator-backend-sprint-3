import {BlogsRepository} from "../repositories/blogs-repository";
import {PostDtoType} from "../types/posts/output";
import {PostsRepository} from "../repositories/posts-repository";
import {postMapper} from "../types/posts/mapper";
import {PostReqBodyCreateType, UpdatePostDto} from "../types/posts/input";
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

        const newPost = await this.postRepository.createPost(newPostData);
        if (!newPost) throw new Error("not_found");

        return postMapper(newPost)
    }

    async updatePost(updateData: PostReqBodyCreateType, postId: string) {
        const blogId = updateData.blogId
        const createdAt = new Date();

        const blog = await this.blogRepository.getBlogById(updateData.blogId)
        if (!blog) throw new Error("not_found");

        const updatePostData: UpdatePostDto = {
            title: updateData.title,
            shortDescription: updateData.shortDescription,
            content: updateData.content,
            blogId: updateData.content
        }

        const isUpdated = await this.postRepository.updatePost(postId, updatePostData);
        if (!isUpdated) throw new Error("not_found");

        const updatedPost = await this.postRepository.getPostById(postId);
        if (!updatedPost) throw new Error("not_found");

        return postMapper(updatedPost)
    }
}
