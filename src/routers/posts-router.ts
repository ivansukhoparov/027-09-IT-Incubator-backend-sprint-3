import {Router} from "express";
import {AuthorizationMiddleware, softAuthentificationMiddleware} from "../middlewares/auth/auth-middleware";
import {validationPostsChains} from "../middlewares/validators/posts-validators";
import {inputValidationMiddleware} from "../middlewares/validators/input-validation-middleware";
import {validateComment, validateLike, validatePost} from "../middlewares/validators/comments-validator";
import {PostsController} from "./controllers/posts-controller";
import {container} from "../composition-root";

export const postsRouter = Router();

const postsController = container.resolve<PostsController>(PostsController);

//GET
postsRouter.get("/",
	softAuthentificationMiddleware,
	postsController.getPost.bind(postsController));

postsRouter.get("/:id/comments",
	softAuthentificationMiddleware,
	validatePost,
	postsController.getPostComments.bind(postsController));

postsRouter.get("/:id",
	softAuthentificationMiddleware,
	postsController.getPostById.bind(postsController));


// POST
postsRouter.post("/",
	AuthorizationMiddleware,
	validationPostsChains(),
	inputValidationMiddleware,
	postsController.createPost.bind(postsController));

postsRouter.post("/:id/comments",
	AuthorizationMiddleware,
	validatePost,
	validateComment,
	inputValidationMiddleware,
	postsController.createCommentToPost.bind(postsController));

//PUT
postsRouter.put("/:id",
	AuthorizationMiddleware,
	validationPostsChains(),
	inputValidationMiddleware,
	postsController.updatePost.bind(postsController));

postsRouter.put("/:id/like-status",
	AuthorizationMiddleware,
	validateLike,
	inputValidationMiddleware,
	postsController.updateLikeStatus.bind(postsController));

// DELETE
postsRouter.delete("/:id", AuthorizationMiddleware,
	postsController.deletePost.bind(postsController));


