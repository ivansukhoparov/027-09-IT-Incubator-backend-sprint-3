import {CommentType} from "../types/comments/output";
import {CreateCommentDataType, UpdateCommentDto} from "../types/comments/input";
import {CommentsRepository} from "../repositories/comments-repository";
import {CommentsQueryRepository} from "../repositories/comments-query-repository";

export class CommentsService{

    static async createComment(createData: CreateCommentDataType) {
        const createdAt = new Date();

        const newComment:CommentType={
            content: createData.content,
            postId: createData.postId,
            commentatorInfo:{
                userId: createData.userId,
                userLogin: createData.userLogin
            },
            createdAt: createdAt.toISOString()
        }

        const commentId = await CommentsRepository.addNewComment(newComment);
        if (!commentId) return null;

        const createdComment = await CommentsQueryRepository.getCommentById(commentId);
        if (!createdComment) return null;

        return createdComment;
    }


    static async updatePost(updateData:UpdateCommentDto, commentId:string){

        return await CommentsRepository.updateCommentById(updateData, commentId);
    }
}
