import {Router} from "express";
import {AuthorizationMiddleware} from "../middlewares/auth/auth-middleware";
import {validationPostsChains} from "../middlewares/validators/posts-validators";
import {inputValidationMiddleware} from "../middlewares/validators/input-validation-middleware";
import {validateComment, validatePost} from "../middlewares/validators/comments-validator";
import {PostsController} from "./controllers/posts-controller";
import {container} from "../composition-root";
import {CommentsController} from "./controllers/comments-controller";

export const postsRouter = Router();

const postsController = container.resolve<PostsController>(PostsController);

//GET
postsRouter.get("/",
    postsController.getPost.bind(postsController));

postsRouter.get("/:id/comments",
    validatePost,
    postsController.getPostComments.bind(postsController));

postsRouter.get("/:id",
    postsController.getPostById.bind(postsController));


// POST
postsRouter.post('/',
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

// DELETE
postsRouter.delete("/:id", AuthorizationMiddleware,
    postsController.deletePost.bind(postsController));


