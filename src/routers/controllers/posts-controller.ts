import {PostsService} from "../../domains/posts-service";
import {
    Params,
    RequestWithBody,
    RequestWithBodyAndParams,
    RequestWithParams,
    RequestWithSearchTerms,
    RequestWithSearchTermsAndParams
} from "../../types/common";
import {
    PostReqBodyCreateType,
    QueryPostRequestType,
    SortPostRepositoryType,
    UpdatePostDto
} from "../../types/posts/input";
import {Response} from "express";
import {PostsQueryRepository} from "../../repositories/posts-query-repository";
import {HTTP_STATUSES} from "../../utils/comon";
import {CreateCommentDataType, CreateCommentDto, SortCommentsType} from "../../types/comments/input";
import {CommentsQueryRepository} from "../../repositories/comments-query-repository";
import {CommentsService} from "../../domains/comments-service";
import {PostsRepository} from "../../repositories/posts-repository";

export class PostsController {
    private postService: PostsService;
    private postsQueryRepository: PostsQueryRepository;
    constructor() {
        this.postService = new PostsService();
        this.postsQueryRepository =new PostsQueryRepository();
    }

    async getPost(req: RequestWithSearchTerms<QueryPostRequestType>, res: Response) {
        try {
            const sortData: SortPostRepositoryType = {
                sortBy: req.query.sortBy || "createdAt",
                sortDirection: req.query.sortDirection || "desc",
                pageNumber: req.query.pageNumber || 1,
                pageSize: req.query.pageSize || 10
            }
            const posts = await this.postsQueryRepository.getAllPosts(sortData);
            res.status(HTTP_STATUSES.OK_200).json(posts);
        } catch {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }

    }

    async getPostById(req: RequestWithParams<Params>, res: Response) {
        try {
            const post = await this.postsQueryRepository.getPostById(req.params.id);
            res.status(HTTP_STATUSES.OK_200).json(post);
        } catch(err:any) {
            if (err.message === "not_found"){
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            }else {
                res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
            }
        }
    }

    async getPostComments(req: RequestWithSearchTermsAndParams<Params, any>, res: Response) {
        const sortData: SortCommentsType = {
            sortBy: req.query.sortBy || "createdAt",
            sortDirection: req.query.sortDirection === "asc" ? 1 : -1,
            pageNumber: +req.query.pageNumber || 1,
            pageSize: +req.query.pageSize || 10
        }
        const comments = await CommentsQueryRepository.getAllCommentsByPostId(sortData, req.params.id);
        if (!comments) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
            return;
        }
        res.status(HTTP_STATUSES.OK_200).json(comments);
    }

    async createPost(req: RequestWithBody<PostReqBodyCreateType>, res: Response) {
        try {
            const createdPost = await this.postService.createNewPost(req.body)
            res.status(HTTP_STATUSES.CREATED_201).json(createdPost);
        } catch {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }

    async createCommentToPost(req: RequestWithBodyAndParams<Params, CreateCommentDto>, res: Response) {
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
    }

    async updatePost(req: RequestWithBodyAndParams<Params, UpdatePostDto>, res: Response) {
        const updateData = req.body;
        const isUpdated = await PostsRepository.updatePost(req.params.id, updateData);
        if (isUpdated) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
            return
        }
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }

    async deletePost(req: RequestWithParams<Params>, res: Response) {
        const isDeleted = await PostsRepository.deletePost(req.params.id);
        if (isDeleted) res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        else res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
}
