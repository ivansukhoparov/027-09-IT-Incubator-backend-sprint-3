import {PostDtoType, PostOutputType} from "../types/posts/output";
import {postMapper} from "../types/posts/mapper";
import {ObjectId, WithId} from "mongodb";
import {PostModel} from "../db/mongoose/models";
import {UpdatePostDto} from "../types/posts/input";


export class PostsRepository {

    // return all posts from database
    async getAllPosts(): Promise<PostOutputType[]> {
        const posts: WithId<PostDtoType>[] = await PostModel.find({}).lean();
        return posts.map(postMapper);
    };

    // return one post with given id
    async getPostById(id: string) {
        return PostModel.findOne({_id: new ObjectId(id)});
    }

    // create new post
    async createPost(postData: PostDtoType) {
        return await PostModel.create(postData)
    }

    // update existing post
    async updatePost(postId: string, data: UpdatePostDto) {
        const result = await PostModel.updateOne({_id: new ObjectId(postId)}, {$set: {...data}});
        return result.matchedCount === 1;
    }

    //delete post
    async deletePost(id: string) {
        const result = await PostModel.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1;
    }
}

