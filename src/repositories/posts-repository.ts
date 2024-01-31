import {PostOutputType, PostDtoType} from "../types/posts/output";
import {PostReqBodyCreateType, UpdatePostDto} from "../types/posts/input";
import {postCollection} from "../db/mongo/mongo-collections";
import {postMapper} from "../types/posts/mapper";
import {BlogsRepository} from "./blogs-repository";
import {ObjectId, WithId} from "mongodb";
import {newError} from "../utils/create-error";


export class PostsRepository {

    // return all posts from database
    async getAllPosts(): Promise<PostOutputType[]> {
        const posts: WithId<PostDtoType>[] = await postCollection.find({}).toArray();
        return posts.map(postMapper);
    };

    // return one post with given id
    async getPostById(id: string) {
        try {
            return await postCollection.findOne({_id: new ObjectId(id)});
        } catch (err) {
            throw new Error("repository_error");
        }
    }

    // create new post
    async createPost(postData: PostDtoType) {
       try{
           const result = await postCollection.insertOne(postData)
           return result.insertedId.toString();
       }catch {
           throw new Error("repository_error");
       }
    }




    // update existing post
    async updatePost(id: string, data: UpdatePostDto) {
        const blog = await BlogsRepository.getBlogById(data.blogId)

        const result = await postCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                title: data.title,
                shortDescription: data.shortDescription,
                content: data.content,
                blogId: data.blogId,
                blogName: blog!.name
            }
        });
        return result.matchedCount === 1;

    }

    //delete post
    async deletePost(id: string) {
        try {
            const result = await postCollection.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1;
        } catch (err) {
            return false
        }

    }
}

