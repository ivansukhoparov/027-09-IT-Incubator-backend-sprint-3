import {CreateBlogDto, UpdateBlogDto} from "../types/blogs/input";
import {BlogType} from "../types/blogs/output";
import {BlogsRepository} from "../repositories/blogs-repository";
import {WithId} from "mongodb";
import {blogMapper} from "../types/blogs/mapper";



export class BlogsService {
    static async createNewBlog(createData:CreateBlogDto){
        const createdAt = new Date();
        const newBlogData: BlogType = {
            name: createData.name,
            description: createData.description,
            websiteUrl: createData.websiteUrl,
            createdAt: createdAt.toISOString(),
            isMembership: false
        }

        const blogID =  await BlogsRepository.createBlog(newBlogData)
        const newBlog:WithId<BlogType>|null = await BlogsRepository.getBlogById(blogID);

        if (!newBlog) return null

        return blogMapper(newBlog)
    }



    static async updateBlog(id:string, data:UpdateBlogDto){
        const updateData = {
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl
        }
        return await BlogsRepository.updateBlog(id,updateData);
    }
}

