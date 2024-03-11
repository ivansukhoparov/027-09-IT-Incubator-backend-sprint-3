import {
	Params,
	RequestWithBody,
	RequestWithBodyAndParams,
	RequestWithParams,
	RequestWithSearchTerms,
	RequestWithSearchTermsAndParams
} from "../../types/common";
import {CreateBlogDto, QueryBlogRequestType, UpdateBlogDto} from "../../types/blogs/input";
import {Response} from "express";
import {BlogsQueryRepository} from "../../repositories/query/blogs-query-repository";
import {HTTP_STATUSES} from "../../utils/comon";
import {PostReqBodyCreateType, QueryPostRequestType} from "../../types/posts/input";
import {PostsQueryRepository} from "../../repositories/query/posts-query-repository";
import {BlogsService} from "../../domains/blogs-service";
import {PostsService} from "../../domains/posts-service";
import {BlogsRepository} from "../../repositories/blogs-repository";
import {inject, injectable} from "inversify";
import {createQuery} from "./utils/create-query";
import {errorsHandler} from "../../utils/errors-handler";


@injectable()
export class BlogController {


	constructor( @inject(BlogsQueryRepository)   protected blogsQueryRepository: BlogsQueryRepository,
                 @inject(PostsQueryRepository)    protected postsQueryRepository: PostsQueryRepository,
                 @inject(BlogsService)   protected blogsService: BlogsService,
                 @inject(PostsService)    protected postService: PostsService,
                 @inject(BlogsRepository)    protected blogsRepository: BlogsRepository) {}

	async getAllBlogs(req: RequestWithSearchTerms<QueryBlogRequestType>, res: Response) {
		try {
			const {sortData, searchData} = createQuery(req.query);
			const blogs = await this.blogsQueryRepository.getAllBlogs(sortData, searchData);
			res.status(HTTP_STATUSES.OK_200).json(blogs);
		}catch (err) {
			errorsHandler(res, err);
		}
	}

	async getBlogById(req: RequestWithParams<Params>, res: Response) {
		try {
			const blog = await this.blogsQueryRepository.getBlogById(req.params.id);
			res.status(HTTP_STATUSES.OK_200).json(blog);
		}catch (err) {
			errorsHandler(res, err);
		}
	}

	async getAllPosts(req: RequestWithSearchTermsAndParams<Params, QueryPostRequestType>, res: Response) {
		try {
			let posts;
			const {sortData} = createQuery(req.query);

			if (req.user) {
				posts = await this.postsQueryRepository.getAllPosts(sortData, req.params.id, req.user.id);
			} else {
				posts = await this.postsQueryRepository.getAllPosts(sortData, req.params.id,);
			}
			res.status(HTTP_STATUSES.OK_200).json(posts);
		}catch (err) {
			errorsHandler(res, err);
		}
	}

	async createBlog(req: RequestWithBody<CreateBlogDto>, res: Response) {
		try{
			const newBlogId = await this.blogsService.createNewBlog(req.body);
			const newBlog = await this.blogsQueryRepository.getBlogById(newBlogId);
			res.status(HTTP_STATUSES.CREATED_201).json(newBlog);
		}catch (err){
			res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
		}
	}

	async createPost(req: RequestWithBodyAndParams<Params, PostReqBodyCreateType>, res: Response) {
		try{
			const createdPostId = await this.postService.createNewPost(req.body, req.params.id); // CHANGE AFTER POSTS REFACTORING
			const createdPost = await this.postsQueryRepository.getPostById(createdPostId);
			res.status(HTTP_STATUSES.CREATED_201).json(createdPost);
		}catch (err){
			res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
		}
	}

	async updateBlog(req: RequestWithBodyAndParams<Params, UpdateBlogDto>, res: Response) {
		try{
			const isUpdate = await this.blogsService.updateBlog(req.params.id, req.body);
			if (isUpdate) {
				res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
			}else{
				throw new Error();
			}
		}catch (err){
			res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
		}
	}

	async deleteBlog(req: RequestWithParams<Params>, res: Response) {
		try{
			await this.blogsService.deleteBlog(req.params.id);
			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
		}catch (err){
			res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
		}
	}
}
