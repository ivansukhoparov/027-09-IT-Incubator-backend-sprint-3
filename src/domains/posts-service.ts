import {BlogsRepository} from "../repositories/blogs-repository";
import {PostDtoType, PostLikeDto} from "../types/posts/output";
import {PostsRepository} from "../repositories/posts-repository";
import {PostReqBodyCreateType, UpdatePostDto} from "../types/posts/input";
import {injectable} from "inversify";
import {LikeStatusType} from "../types/comments/input";

@injectable()
export class PostsService {

	constructor(protected postRepository: PostsRepository,
                protected blogRepository: BlogsRepository) {
	}

	async createNewPost(createData: PostReqBodyCreateType, id?: string) {
		const blogId = id ? id : createData.blogId;
		const createdAt = new Date();

		const blog = await this.blogRepository.getBlogById(blogId);
		if (!blog) throw new Error("not_found");

		const newPostData: PostDtoType = {
			title: createData.title,
			shortDescription: createData.shortDescription,
			content: createData.content,
			blogId: blogId,
			blogName: blog.name,
			createdAt: createdAt.toISOString()
		};

		const newPostId = await this.postRepository.createPost(newPostData);

		return newPostId;
	}

	async updatePost(updateData: PostReqBodyCreateType, postId: string) {
		const blogId = updateData.blogId;
		const createdAt = new Date();

		const blog = await this.blogRepository.getBlogById(updateData.blogId);
		if (!blog) throw new Error("not_found");

		const updatePostData: UpdatePostDto = {
			title: updateData.title,
			shortDescription: updateData.shortDescription,
			content: updateData.content,
			blogId: updateData.content
		};

		const isUpdated = await this.postRepository.updatePost(postId, updatePostData);

		return isUpdated;
	}

	async updateLike(user: {id: string,login: string}, postId: string, status: LikeStatusType) {
		const createdAt = (new Date()).toISOString();
		const updateModel: PostLikeDto = {
			postId: postId,
			likedUserId: user.id,
			likedUserName: user.login,
			addedAt: createdAt,
			status: status
		};
		await this.postRepository.updatePostLike(updateModel);
	}
}
