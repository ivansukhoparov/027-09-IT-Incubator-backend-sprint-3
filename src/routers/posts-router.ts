import {Router} from "express";
import {AuthorizationMiddleware} from "../middlewares/auth/auth-middleware";
import {validationPostsChains} from "../middlewares/validators/posts-validators";
import {inputValidationMiddleware} from "../middlewares/validators/input-validation-middleware";
import {validateComment, validatePost} from "../middlewares/validators/comments-validator";
import {PostsController} from "./controllers/posts-controller";

export const postsRouter = Router();

const postsControllerInstance = new PostsController()

//GET
postsRouter.get("/",
    postsControllerInstance.getPost.bind(postsControllerInstance));

postsRouter.get("/:id/comments",
    validatePost,
    postsControllerInstance.getPostComments.bind(postsControllerInstance));

postsRouter.get("/:id",
    postsControllerInstance.getPostById.bind(postsControllerInstance));


// POST
postsRouter.post('/',
    AuthorizationMiddleware,
    validationPostsChains(),
    inputValidationMiddleware,
    postsControllerInstance.createPost.bind(postsControllerInstance));

postsRouter.post("/:id/comments",
    AuthorizationMiddleware,
    validatePost,
    validateComment,
    inputValidationMiddleware,
    postsControllerInstance.createCommentToPost.bind(postsControllerInstance));

//PUT
postsRouter.put("/:id",
    AuthorizationMiddleware,
    validationPostsChains(),
    inputValidationMiddleware,
    postsControllerInstance.updatePost.bind(postsControllerInstance));

// DELETE
postsRouter.delete("/:id", AuthorizationMiddleware,
    postsControllerInstance.deletePost.bind(postsControllerInstance));


