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
import {BlogsQueryRepository} from "../repositories/blogs-query-repository";
import {validationPostsChainsNoBlogId} from "../middlewares/validators/posts-validators";
import {PostReqBodyCreateType, QueryPostRequestType, SortPostRepositoryType} from "../types/posts/input";
import {PostsQueryRepository} from "../repositories/posts-query-repository";
import {BlogsService} from "../domains/blogs-service";
import {PostsService} from "../domains/posts-service";
import {BlogController} from "./controllers/blog-controller";


export const blogsRouter = Router();

const blogControllerInstance = new BlogController();

blogsRouter.get("/", blogControllerInstance.getAllBlogs.bind(blogControllerInstance));

blogsRouter.get("/:id", blogControllerInstance.getBlogById.bind(blogControllerInstance));

blogsRouter.get("/:id/posts", blogControllerInstance.getAllPosts.bind(blogControllerInstance));

blogsRouter.post('/',
    AuthorizationMiddleware,
    validationBlogsChains(),
    inputValidationMiddleware,
    blogControllerInstance.createBlog.bind(blogControllerInstance));

blogsRouter.post("/:id/posts",
    AuthorizationMiddleware,
    validationPostsChainsNoBlogId(),
    inputValidationMiddleware,
    blogControllerInstance.createPost.bind(blogControllerInstance));

blogsRouter.put("/:id",
    AuthorizationMiddleware,
    validationBlogsChains(),
    inputValidationMiddleware,
    blogControllerInstance.updateBlog.bind(blogControllerInstance));

blogsRouter.delete("/:id",
    AuthorizationMiddleware,
    blogControllerInstance.deleteBlog.bind(blogControllerInstance));
