import {BlogType} from "../types/blogs/output";
import {UpdateBlogDto} from "../types/blogs/input";
import {ObjectId, WithId} from "mongodb";
import {blogMapper} from "../types/blogs/mapper";
import {BlogModel} from "../db/mongoose/models";

export class BlogsRepository {

    // return all blogs from database
    async getAllBlogs() {
        const blogs: WithId<BlogType>[] = await BlogModel.find({}).lean();
        return blogs.map(blogMapper)
    };

    // return one blog by id
    async getBlogById(id: string) {
        try {
            return await BlogModel.findOne({_id: new ObjectId(id)});
        } catch (err) {
            return null;
        }
    }

    // create new blog
    async createBlog(newBlog: BlogType) {
        const result = await BlogModel.create(newBlog)
        return result._id.toString();
    }

    // update existing blog
    async updateBlog(id: string, updateData: UpdateBlogDto) {

        const result = await BlogModel.updateOne({_id: new ObjectId(id)},
            {
                $set:
                updateData
            }
        )
        return result.matchedCount === 1;
    }

    //delete blog
    async deleteBlog(id: string) {
        try {
            const result = await BlogModel.deleteOne({_id: new ObjectId(id)});

            return result.deletedCount === 1;
        } catch (err) {
            return false;
        }
    }
}


// === OLD VERSION OF REPOSITORIES USES NATIVE MONGO DRIVER ===
//
// export class BlogsRepository {
//
//     // return all blogs from database
//     static async getAllBlogs() {
//         const blogs: WithId<BlogType>[] = await blogCollection.find({}).toArray();
//         return blogs.map(blogMapper)
//     };
//
//     // return one blog by id
//     static async getBlogById(id: string) {
//         try {
//             return await blogCollection.findOne({_id: new ObjectId(id)});
//         } catch (err) {
//             return null;
//         }
//     }
//
//     // create new blog
//     static async createBlog(newBlog: BlogType) {
//         const result = await blogCollection.insertOne(newBlog)
//         return result.insertedId.toString();
//     }
//
//     // update existing blog
//     static async updateBlog(id: string, updateData: UpdateBlogDto) {
//
//         const result = await blogCollection.updateOne({_id: new ObjectId(id)},
//             {
//                 $set:
//                 updateData
//             }
//         );
//
//         return result.matchedCount === 1;
//     }
//
//     //delete blog
//     static async deleteBlog(id: string) {
//         try {
//             const result = await blogCollection.deleteOne({_id: new ObjectId(id)});
//
//             return result.deletedCount === 1;
//         } catch (err) {
//             return false;
//         }
//
//     }
// }

