import {Router, Request, Response} from "express";
import {BlogsRepository} from "../repositories/blogs-repository";
import {
	Params,
	RequestWithBody,
	RequestWithBodyAndParams,
	RequestWithParams,
	RequestWithSearchTerms, RequestWithSearchTermsAndParams
} from "../types/common";
import {
	CreateBlogDto,
	QueryBlogRequestType,
	SearchBlogRepositoryType,
	SortBlogRepositoryType,
	UpdateBlogDto
} from "../types/blogs/input";
import {inputValidationMiddleware} from "../middlewares/validators/input-validation-middleware";
import {validationBlogsChains} from "../middlewares/validators/blogs-validators";
import {AuthorizationMiddleware} from "../middlewares/auth/auth-middleware";
import {HTTP_STATUSES} from "../utils/comon";
import {BlogsQueryRepository} from "../repositories/query/blogs-query-repository";
import {validationPostsChainsNoBlogId} from "../middlewares/validators/posts-validators";
import {PostReqBodyCreateType, QueryPostRequestType, SortPostRepositoryType} from "../types/posts/input";
import {PostsQueryRepository} from "../repositories/query/posts-query-repository";
import {BlogsService} from "../domains/blogs-service";
import {PostsService} from "../domains/posts-service";
import {BlogController} from "./controllers/blog-controller";
import {container} from "../composition-root";


export const blogsRouter = Router();

const blogController = container.resolve<BlogController>(BlogController);

blogsRouter.get("/", blogController.getAllBlogs.bind(blogController));

blogsRouter.get("/:id", blogController.getBlogById.bind(blogController));

blogsRouter.get("/:id/posts", blogController.getAllPosts.bind(blogController));

blogsRouter.post("/",
	AuthorizationMiddleware,
	validationBlogsChains(),
	inputValidationMiddleware,
	blogController.createBlog.bind(blogController));

blogsRouter.post("/:id/posts",
	AuthorizationMiddleware,
	validationPostsChainsNoBlogId(),
	inputValidationMiddleware,
	blogController.createPost.bind(blogController));

blogsRouter.put("/:id",
	AuthorizationMiddleware,
	validationBlogsChains(),
	inputValidationMiddleware,
	blogController.updateBlog.bind(blogController));

blogsRouter.delete("/:id",
	AuthorizationMiddleware,
	blogController.deleteBlog.bind(blogController));
