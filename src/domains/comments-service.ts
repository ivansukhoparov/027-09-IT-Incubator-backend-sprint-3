import {CommentType} from "../types/comments/output";
import {CreateCommentDataType, UpdateCommentDto} from "../types/comments/input";
import {CommentsRepository} from "../repositories/comments-repository";
import {CommentsQueryRepository} from "../repositories/comments-query-repository";
import {BlogsRepository} from "../repositories/blogs-repository";

export class CommentsService{
    private commentsRepository: CommentsRepository;
    private commentsQueryRepository: CommentsQueryRepository;
    constructor() {
        this.commentsRepository = new CommentsRepository();
        this.commentsQueryRepository = new CommentsQueryRepository();
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
        }

        const commentId = await  this.commentsRepository.addNewComment(newComment);
        if (!commentId) return null;

        const createdComment = await this.commentsQueryRepository.getCommentById(commentId);
        if (!createdComment) return null;

        return createdComment;
    }


     async updatePost(updateData:UpdateCommentDto, commentId:string){

        return await  this.commentsRepository.updateCommentById(updateData, commentId);
    }
}
