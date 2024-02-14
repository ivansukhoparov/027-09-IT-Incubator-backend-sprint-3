import {commentsCollection} from "../../db/mongo/mongo-collections";
import {ObjectId} from "mongodb";
import {commentMapper} from "../../types/comments/mapper";
import {LikeStatusType, SortCommentsType} from "../../types/comments/input";
import {LikesInfoType, OutputCommentType} from "../../types/comments/output";
import {ViewModelType} from "../../types/view-model";
import {injectable} from "inversify";
import {CommentLikeModel} from "../../db/mongoose/models";

@injectable()
export class CommentsQueryRepository {
	async getAllCommentsByPostId(sortData: SortCommentsType, postId: string, userId?:string): Promise<ViewModelType<OutputCommentType> | null> {
		try {
			const commentsCount = await commentsCollection.countDocuments({postId: postId});
			const pagesCount = Math.ceil(commentsCount / sortData.pageSize);
			const skipComments = (sortData.pageNumber - 1) * sortData.pageSize;

			const comments = await commentsCollection.find({postId: postId})
				.sort(sortData.sortBy, sortData.sortDirection)
				.skip(skipComments)
				.limit(sortData.pageSize)
				.toArray();

			const mappedComments:OutputCommentType[]=[];

			for (let i= 0; i<comments.length; i++){
				const likes:LikesInfoType = await this.getLikes(comments[i]._id.toString(), userId);
				mappedComments.push(commentMapper(comments[i], likes));
			}

			return {
				pagesCount: pagesCount,
				page: sortData.pageNumber,
				pageSize: sortData.pageSize,
				totalCount: commentsCount,
				items: mappedComments
			};
		} catch (err) {
			return null;
		}
	}

	async getCommentById(commentId: string, userId?:string) {
		try {
			const comment = await commentsCollection.findOne({_id: new ObjectId(commentId)});
			const likes:LikesInfoType = await this.getLikes(commentId, userId);

			if (comment) return commentMapper(comment, likes);
			else return null;
		}catch (err){
			return null;
		}
	}

	async getLikes(commentId:string, userId?:string):Promise<LikesInfoType>{
		let likeStatus:LikeStatusType = "None";

		if (userId) {
			const userLike = await CommentLikeModel.findOne({$and: [{commentId: commentId}, {likedUserId: userId}]}).lean();
			if (userLike) {
				likeStatus = userLike.status;
			}
		}

		const likesCount =  await CommentLikeModel.countDocuments({$and: [{commentId: commentId}, {status:"Like"}]});
		const dislikesCount =  await CommentLikeModel.countDocuments({$and: [{commentId: commentId}, {status:"Dislike"}]});
		return 	{
			likesCount: likesCount,
			dislikesCount: dislikesCount,
			myStatus: likeStatus
		};
	}
}

