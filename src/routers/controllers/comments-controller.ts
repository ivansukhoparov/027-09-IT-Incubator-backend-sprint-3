import {Params, RequestWithBodyAndParams, RequestWithParams} from "../../types/common";
import {Response} from "express";
import {CommentsQueryRepository} from "../../repositories/query/comments-query-repository";
import {HTTP_STATUSES} from "../../utils/comon";
import {InputCommentLikesType, UpdateCommentDto} from "../../types/comments/input";
import {CommentsService} from "../../domains/comments-service";
import {CommentsRepository} from "../../repositories/comments-repository";
import {inject, injectable} from "inversify";
import {errorsHandler} from "../../utils/errors-handler";

@injectable()
export class CommentsController {

	constructor(@inject(CommentsQueryRepository)    protected commentsQueryRepository: CommentsQueryRepository,
                @inject(CommentsService)    protected  commentService: CommentsService,
                @inject(CommentsRepository)    protected  commentsRepository: CommentsRepository) {

	}

	async getComments(req: RequestWithParams<Params>, res: Response) {

		let comment;
		if (req.user) {
			comment = await this.commentsQueryRepository.getCommentById(req.params.id, req.user.id);
		} else {
			comment = await this.commentsQueryRepository.getCommentById(req.params.id);
		}

		if (!comment) {
			res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
			return;
		}

		res.status(HTTP_STATUSES.OK_200).json(comment);
	}


	async updateComment(req: RequestWithBodyAndParams<Params, { content: string }>, res: Response) {

		const updateData: UpdateCommentDto = {
			content: req.body.content
		};

		const isUpdated = await this.commentService.updatePost(updateData, req.params.id,);
		if (!isUpdated) {
			res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
			return;
		}
		res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
	}

	async updateLikeStatus(req: RequestWithBodyAndParams<Params, InputCommentLikesType>, res: Response) {
		try {
			await this.commentService.updateLike(req.user.id, req.params.id, req.body.likeStatus);
			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
		} catch (err) {
			errorsHandler(res, err);
		}
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
