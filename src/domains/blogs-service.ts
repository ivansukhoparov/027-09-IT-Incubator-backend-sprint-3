import {CreateBlogDto, UpdateBlogDto} from "../types/blogs/input";
import {BlogType} from "../types/blogs/output";
import {BlogsRepository} from "../repositories/blogs-repository";
import {WithId} from "mongodb";
import {blogMapper} from "../types/blogs/mapper";
import {RefreshTokenRepository} from "../repositories/refresh-token-repository";
import {UsersRepository} from "../repositories/users-repository";
import {injectable} from "inversify";


@injectable()
export class BlogsService {
	constructor(protected blogsRepository: BlogsRepository) {
	}

	async createNewBlog(createData:CreateBlogDto){
		const createdAt = new Date();
		const newBlogData: BlogType = {
			name: createData.name,
			description: createData.description,
			websiteUrl: createData.websiteUrl,
			createdAt: createdAt.toISOString(),
			isMembership: false
		};
		const blogID =  await this.blogsRepository.createBlog(newBlogData);
		return blogID;
	}

	async updateBlog(blogId:string, data:UpdateBlogDto){
		const updateData = {
			name: data.name,
			description: data.description,
			websiteUrl: data.websiteUrl
		};
		return await this.blogsRepository.updateBlog(blogId,updateData);
	}

	async deleteBlog(blogId:string){
		await this.blogsRepository.deleteBlog(blogId);
	}
}

