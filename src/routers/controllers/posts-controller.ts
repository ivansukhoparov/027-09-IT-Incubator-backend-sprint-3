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
import {PostsQueryRepository} from "../../repositories/query/posts-query-repository";
import {HTTP_STATUSES} from "../../utils/comon";
import {
	CreateCommentDataType,
	CreateCommentDto,
	InputCommentLikesType,
	SortCommentsType
} from "../../types/comments/input";
import {CommentsQueryRepository} from "../../repositories/query/comments-query-repository";
import {CommentsService} from "../../domains/comments-service";
import {PostsRepository} from "../../repositories/posts-repository";
import {inject, injectable} from "inversify";
import {errorsHandler} from "../../utils/errors-handler";

@injectable()
export class PostsController {
	constructor(@inject(PostsService) protected postService: PostsService,
                @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
                @inject(PostsRepository) protected postsRepository: PostsRepository,
                @inject(CommentsService) protected commentsService: CommentsService,
                @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository) {
	}

	async getPost(req: RequestWithSearchTerms<QueryPostRequestType>, res: Response) {
		try {
			let posts;
			const sortData: SortPostRepositoryType = {
				sortBy: req.query.sortBy || "createdAt",
				sortDirection: req.query.sortDirection  ? req.query.sortDirection : "desc",
				pageNumber: req.query.pageNumber || 1,
				pageSize: req.query.pageSize || 10
			};
			console.log(req.user);
			if (req.user) {
				posts = await this.postsQueryRepository.getAllPosts(sortData, null, req.user.id);
			} else {
				posts = await this.postsQueryRepository.getAllPosts(sortData);
			}
			res.status(HTTP_STATUSES.OK_200).json(posts);
		} catch {
			res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
		}

	}

	async getPostById(req: RequestWithParams<Params>, res: Response) {
		try {
			let post;
			if (req.user) {
				post = await this.postsQueryRepository.getPostById(req.params.id, req.user.id);
			} else {
				post = await this.postsQueryRepository.getPostById(req.params.id);
			}

			res.status(HTTP_STATUSES.OK_200).json(post);
		} catch(err:any) {
			if (err.message === "not_found"){
				res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
			}else {
				res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
			}
		}
	}

	async getPostComments(req: RequestWithSearchTermsAndParams<Params, any>, res: Response) {
		const sortData: SortCommentsType = {
			sortBy: req.query.sortBy || "createdAt",
			sortDirection: req.query.sortDirection  ? req.query.sortDirection : "desc",
			pageNumber: +req.query.pageNumber || 1,
			pageSize: +req.query.pageSize || 10
		};
		const comments = await this.commentsQueryRepository.getAllCommentsByPostId(sortData, req.params.id, req.user.id);
		if (!comments) {
			res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
			return;
		}
		res.status(HTTP_STATUSES.OK_200).json(comments);
	}

	async createPost(req: RequestWithBody<PostReqBodyCreateType>, res: Response) {
		try {
			const createdPostId = await this.postService.createNewPost(req.body);
			const createdPost = await this.postsQueryRepository.getPostById(createdPostId);
			res.status(HTTP_STATUSES.CREATED_201).json(createdPost);
		} catch {
			res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
		}
	}

	async createCommentToPost(req: RequestWithBodyAndParams<Params, CreateCommentDto>, res: Response) {
		const createCommentData: CreateCommentDataType = {
			content: req.body.content,
			userId: req.user.id,
			userLogin: req.user.login,
			postId: req.params.id
		};
		const comment = await this.commentsService.createComment(createCommentData);
		if (!comment) {
			res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
			return;
		}
		res.status(HTTP_STATUSES.CREATED_201).json(comment);
	}

	async updatePost(req: RequestWithBodyAndParams<Params, UpdatePostDto>, res: Response) {
		try {
			const isUpdated = await this.postService.updatePost(req.body, req.params.id);
			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
		}catch {
			res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
		}
	}

	async updateLikeStatus(req: RequestWithBodyAndParams<Params, InputCommentLikesType>, res: Response) {
		try {
			const user = {
				id: req.user.id,
				login: req.user.login
			};

			await this.postService.updateLike(user, req.params.id, req.body.likeStatus);
			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
		} catch (err) {
			errorsHandler(res, err);
		}
	}

	async deletePost(req: RequestWithParams<Params>, res: Response) {
		const isDeleted = await this.postsRepository.deletePost(req.params.id);
		if (isDeleted) res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
		else res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
	}
}
