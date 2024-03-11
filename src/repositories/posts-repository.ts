import {PostDtoType, PostLikeDto} from "../types/posts/output";
import {ObjectId} from "mongodb";
import {CommentLikeModel, PostLikeModel, PostModel} from "../db/mongoose/models";
import {UpdatePostDto} from "../types/posts/input";
import {injectable} from "inversify";

@injectable()
export class PostsRepository {

	// return one post with given id
	async getPostById(id: string) {
		return PostModel.findOne({_id: new ObjectId(id)},);
	}

	// create new post
	async createPost(postData: PostDtoType) {
		const newPost = await PostModel.create(postData);
		return newPost._id.toString();
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

	async updatePostLike(updateModel: PostLikeDto) {

		const post = await PostModel.findOne({_id: new ObjectId(updateModel.postId)});
		if (!post) throw new Error();
		// const like = await PostLikeModel.findOne({$and: [{likedUserId: updateModel.likedUserId}, {postId: updateModel.postId}]});

		const like = await PostLikeModel.findOneAndUpdate({$and: [{likedUserName: updateModel.likedUserName}, {postId: updateModel.postId}]},updateModel );

		if (!like) {
			await PostLikeModel.create(updateModel);
		}
	}
}

