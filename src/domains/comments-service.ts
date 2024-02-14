import {CommentLikeDTO, CommentType} from "../types/comments/output";
import {CreateCommentDataType, LikeStatusType, UpdateCommentDto} from "../types/comments/input";
import {CommentsRepository} from "../repositories/comments-repository";
import {CommentsQueryRepository} from "../repositories/query/comments-query-repository";
import {inject, injectable} from "inversify";

@injectable()
export class CommentsService {
	constructor(@inject(CommentsRepository) protected commentsRepository: CommentsRepository,
                @inject(CommentsQueryRepository)protected commentsQueryRepository: CommentsQueryRepository) {
	}

	async createComment(createData: CreateCommentDataType) {
		const createdAt = new Date();

		const newComment:CommentType={
			content: createData.content,
			postId: createData.postId,
			commentatorInfo:{
				userId: createData.userId,
				userLogin: createData.userLogin
			},
			createdAt: createdAt.toISOString()
		};

		const commentId = await  this.commentsRepository.addNewComment(newComment);
		if (!commentId) return null;

		const createdComment = await this.commentsQueryRepository.getCommentById(commentId,createData.userId);
		if (!createdComment) return null;

		return createdComment;
	}


	async updatePost(updateData:UpdateCommentDto, commentId:string){

		return await  this.commentsRepository.updateCommentById(updateData, commentId);
	}


	async updateLike(userId: string, commentId: string, status: LikeStatusType) {

		const updateModel: CommentLikeDTO = {
			commentId: commentId,
			likedUserId: userId,
			status: status
		};
		await this.commentsRepository.updateCommentLike(updateModel);
	}
}
