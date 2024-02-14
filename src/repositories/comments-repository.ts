import {CommentLikeDTO, CommentType} from "../types/comments/output";
import {commentsCollection} from "../db/mongo/mongo-collections";
import {ObjectId} from "mongodb";
import {UpdateCommentDto} from "../types/comments/input";
import {injectable} from "inversify";
import {CommentLikeModel, CommentsModel} from "../db/mongoose/models";

@injectable()
export class CommentsRepository{
	async addNewComment(newComment: CommentType): Promise<string | null> {
		try{
			const result = await commentsCollection.insertOne(newComment);
			return result.insertedId.toString();
		}catch (err){
			return null;
		}
	}

	async deleteCommentById(commentId: string) {
		try {
			const result = await commentsCollection.deleteOne({_id:new ObjectId(commentId)});
			return result.deletedCount === 1;
		}catch (err){
			return null;
		}
	}

	async updateCommentById(updateData: UpdateCommentDto, id: string) {
		try {

			const result = await commentsCollection.updateOne(
				{_id:new ObjectId(id)},
				{ $set: updateData}
			);
			return result.matchedCount === 1;
		}catch(err){
			return false;
		}
	}

	async updateCommentLike(updateModel: CommentLikeDTO) {

		const comment = await CommentsModel.findOne({_id: new ObjectId(updateModel.commentId)});
		if (!comment) throw new Error();
		const like = await CommentLikeModel.findOne({$and: [{likedUserId: updateModel.likedUserId}, {commentId: updateModel.commentId}]});

		if (like) {
			like.status = updateModel.status;
			like.save();
			// await CommentLikeModel.updateOne({_id: like._id}, {
			// 	$set: {
			// 		status: updateModel.status
			// 	}
			// });
		} else {
			await CommentLikeModel.create(updateModel);
		}

	}
}

