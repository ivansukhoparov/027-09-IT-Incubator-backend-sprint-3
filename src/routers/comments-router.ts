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
import {CommentsController} from "./controllers/comments-controller";

export const commentsRouter = Router();
const commentsControllerInstance = new CommentsController();

commentsRouter.get("/:id", commentsControllerInstance.getComments.bind(commentsControllerInstance));

commentsRouter.put("/:id",
    AuthorizationMiddleware,
    accessRight,
    validateComment,
    inputValidationMiddleware,
    commentsControllerInstance.updateComment.bind(commentsControllerInstance));

commentsRouter.delete("/:id",
    AuthorizationMiddleware,
    accessRight,
    commentsControllerInstance.deleteComment.bind(commentsControllerInstance));
