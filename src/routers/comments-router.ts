import {Response, Router} from "express";
import {Params, RequestWithBodyAndParams, RequestWithParams} from "../types/common";
import {CommentsQueryRepository} from "../repositories/comments-query-repository";
import {HTTP_STATUSES} from "../utils/comon";
import {CommentsRepository} from "../repositories/comments-repository";
import {accessRight, AuthorizationMiddleware} from "../middlewares/auth/auth-middleware";
import {UpdateCommentDto} from "../types/comments/input";
import {validateComment} from "../middlewares/validators/comments-validator";
import {inputValidationMiddleware} from "../middlewares/validators/input-validation-middleware";
import {CommentsService} from "../domains/comments-service";

export const commentsRouter = Router();

commentsRouter.get("/:id", async (req: RequestWithParams<Params>, res: Response) => {
    const comment = await CommentsQueryRepository.getCommentById(req.params.id);
    if (!comment) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.status(HTTP_STATUSES.OK_200).json(comment);
})

commentsRouter.put("/:id",
    AuthorizationMiddleware,
    accessRight,
    validateComment,
    inputValidationMiddleware,
    async (req: RequestWithBodyAndParams<Params, { content: string }>, res: Response) => {

    const updateData: UpdateCommentDto = {
            content: req.body.content
        }

        const isUpdated = await CommentsService.updatePost(updateData, req.params.id,);
        if (!isUpdated) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    })

commentsRouter.delete("/:id", AuthorizationMiddleware, accessRight, async (req: RequestWithParams<Params>, res: Response) => {
    const isDeleted = await CommentsRepository.deleteCommentById(req.params.id);
    if (isDeleted === null) {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
        return;
    }
    if (!isDeleted) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
})
