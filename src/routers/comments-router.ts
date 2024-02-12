import {Router} from "express";
import {accessRight, AuthorizationMiddleware} from "../middlewares/auth/auth-middleware";
import {validateComment} from "../middlewares/validators/comments-validator";
import {inputValidationMiddleware} from "../middlewares/validators/input-validation-middleware";
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

commentsRouter.put("/:id/like-status",
	AuthorizationMiddleware,
	accessRight,
	validateComment,
	inputValidationMiddleware,
	commentsControllerInstance.updateComment.bind(commentsControllerInstance));

commentsRouter.delete("/:id",
	AuthorizationMiddleware,
	accessRight,
	commentsControllerInstance.deleteComment.bind(commentsControllerInstance));
