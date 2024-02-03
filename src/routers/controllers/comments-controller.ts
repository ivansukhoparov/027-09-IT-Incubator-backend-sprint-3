import {Params, RequestWithBodyAndParams, RequestWithParams} from "../../types/common";
import {Response} from "express";
import {CommentsQueryRepository} from "../../repositories/comments-query-repository";
import {HTTP_STATUSES} from "../../utils/comon";
import {UpdateCommentDto} from "../../types/comments/input";
import {CommentsService} from "../../domains/comments-service";
import {CommentsRepository} from "../../repositories/comments-repository";
import {inject, injectable} from "inversify";

@injectable()
export class CommentsController {


    constructor(@inject(CommentsQueryRepository)    protected commentsQueryRepository: CommentsQueryRepository,
                @inject(CommentsService)    protected  commentService: CommentsService,
                @inject(CommentsRepository)    protected  commentsRepository: CommentsRepository) {

    }

    async getComments(req: RequestWithParams<Params>, res: Response) {
        const comment = await this.commentsQueryRepository.getCommentById(req.params.id);
        if (!comment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.status(HTTP_STATUSES.OK_200).json(comment);
    }


    async updateComment(req: RequestWithBodyAndParams<Params, { content: string }>, res: Response) {

        const updateData: UpdateCommentDto = {
            content: req.body.content
        }

        const isUpdated = await this.commentService.updatePost(updateData, req.params.id,);
        if (!isUpdated) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }

    async deleteComment(req: RequestWithParams<Params>, res: Response) {
        const isDeleted = await this.commentsRepository.deleteCommentById(req.params.id);
        if (isDeleted === null) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
            return;
        }
        if (!isDeleted) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }

}
