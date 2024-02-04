import {Response, Router} from "express";
import {Params, RequestWithBodyAndParams, RequestWithParams} from "../types/common";
import {CommentsQueryRepository} from "../repositories/query/comments-query-repository";
import {HTTP_STATUSES} from "../utils/comon";
import {CommentsRepository} from "../repositories/comments-repository";
import {accessRight, AuthorizationMiddleware} from "../middlewares/auth/auth-middleware";
import {UpdateCommentDto} from "../types/comments/input";
import {validateComment} from "../middlewares/validators/comments-validator";
import {inputValidationMiddleware} from "../middlewares/validators/input-validation-middleware";
import {CommentsService} from "../domains/comments-service";
import {CommentsController} from "./controllers/comments-controller";
import {container} from "../composition-root";

export const commentsRouter = Router();
const commentsControllerInstance = container.resolve<CommentsController>(CommentsController);

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
