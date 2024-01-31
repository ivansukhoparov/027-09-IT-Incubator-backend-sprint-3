import {Response, Router} from "express";
import {
    Params,
    RequestWithBody,
    RequestWithBodyAndParams,
    RequestWithParams,
    RequestWithSearchTerms,
    RequestWithSearchTermsAndParams
} from "../types/common";
import {AuthorizationMiddleware} from "../middlewares/auth/auth-middleware";
import {HTTP_STATUSES} from "../utils/comon";
import {PostsRepository} from "../repositories/posts-repository";
import {PostReqBodyCreateType, QueryPostRequestType, SortPostRepositoryType, UpdatePostDto} from "../types/posts/input";
import {validationPostsChains} from "../middlewares/validators/posts-validators";
import {inputValidationMiddleware} from "../middlewares/validators/input-validation-middleware";
import {PostsQueryRepository} from "../repositories/posts-query-repository";
import {PostsService} from "../domains/posts-service";
import {CreateCommentDataType, CreateCommentDto, SortCommentsType} from "../types/comments/input";
import {CommentsService} from "../domains/comments-service";
import {validateComment, validatePost} from "../middlewares/validators/comments-validator";
import {CommentsQueryRepository} from "../repositories/comments-query-repository";

export const postsRouter = Router();

export class UsersController {
    private postService: PostsService;

    constructor() {
        this.postService = new PostsService();
    }


    async getPost(req: RequestWithSearchTerms<QueryPostRequestType>, res: Response) {
        try {
            const sortData: SortPostRepositoryType = {
                sortBy: req.query.sortBy || "createdAt",
                sortDirection: req.query.sortDirection || "desc",
                pageNumber: req.query.pageNumber || 1,
                pageSize: req.query.pageSize || 10
            }
            const posts = await PostsQueryRepository.getAllPosts(sortData);
            res.status(HTTP_STATUSES.OK_200).json(posts);
        } catch {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }

    }


    async createPost(req: RequestWithBody<PostReqBodyCreateType>, res: Response) {
        try {
            const createdPost = await this.postService.createNewPost(req.body)
            res.status(HTTP_STATUSES.CREATED_201).json(createdPost);
        } catch {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }
}

const userControllerInstance = new UsersController()

//GET
postsRouter.get("/", userControllerInstance.getPost.bind(userControllerInstance));
postsRouter.get("/:id/comments", validatePost, async (req: RequestWithSearchTermsAndParams<Params, any>, res: Response) => {
    const sortData: SortCommentsType = {
        sortBy: req.query.sortBy || "createdAt",
        sortDirection: req.query.sortDirection === "asc" ? 1 : -1,
        pageNumber: +req.query.pageNumber || 1,
        pageSize: +req.query.pageSize || 10
    }
    const comments = await CommentsQueryRepository.getAllCommentsByPostId(sortData,req.params.id);
    if (!comments){
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
        return;
    }
    res.status(HTTP_STATUSES.OK_200).json(comments);
})

postsRouter.get("/:id", async (req: RequestWithParams<Params>, res: Response) => {
    const post = await PostsQueryRepository.getPostById(req.params.id);
    if (post) {
        res.status(HTTP_STATUSES.OK_200).json(post);
        return
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }
})

// POST
postsRouter.post('/',
    AuthorizationMiddleware,
    validationPostsChains(),
    inputValidationMiddleware,
    userControllerInstance.createPost.bind(userControllerInstance)
)

postsRouter.post("/:id/comments",
    AuthorizationMiddleware,
    validatePost,
    validateComment,
    inputValidationMiddleware,
    async (req: RequestWithBodyAndParams<Params, CreateCommentDto>, res: Response) => {
    const createCommentData: CreateCommentDataType = {
        content: req.body.content,
        userId: req.user.id,
        userLogin: req.user.login,
        postId: req.params.id
    };
    const comment = await CommentsService.createComment(createCommentData);
    if (!comment) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    res.status(HTTP_STATUSES.CREATED_201).json(comment);
})


//PUT
postsRouter.put("/:id", AuthorizationMiddleware, validationPostsChains(), inputValidationMiddleware, async (req: RequestWithBodyAndParams<Params, UpdatePostDto>, res: Response) => {
    const updateData = req.body;
    const isUpdated = await PostsRepository.updatePost(req.params.id, updateData);
    if (isUpdated) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        return
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
})

postsRouter.delete("/:id", AuthorizationMiddleware, async (req: RequestWithParams<Params>, res: Response) => {
    const isDeleted = await PostsRepository.deletePost(req.params.id);
    if (isDeleted) res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    else res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
})


