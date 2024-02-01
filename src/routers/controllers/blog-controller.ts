import {
    Params,
    RequestWithBody,
    RequestWithBodyAndParams,
    RequestWithParams,
    RequestWithSearchTerms,
    RequestWithSearchTermsAndParams
} from "../../types/common";
import {
    CreateBlogDto,
    QueryBlogRequestType,
    SearchBlogRepositoryType,
    SortBlogRepositoryType,
    UpdateBlogDto
} from "../../types/blogs/input";
import {Response} from "express";
import {BlogsQueryRepository} from "../../repositories/blogs-query-repository";
import {HTTP_STATUSES} from "../../utils/comon";
import {PostReqBodyCreateType, QueryPostRequestType, SortPostRepositoryType} from "../../types/posts/input";
import {PostsQueryRepository} from "../../repositories/posts-query-repository";
import {BlogsService} from "../../domains/blogs-service";
import {PostsService} from "../../domains/posts-service";
import {BlogsRepository} from "../../repositories/blogs-repository";

// Redone delete - it must work through service
export class BlogController {
    private blogsQueryRepository: BlogsQueryRepository;
    private postsQueryRepository: PostsQueryRepository;
    private blogsService: BlogsService;
    private postService: PostsService;
    private blogsRepository: BlogsRepository;

    constructor() {
        this.blogsQueryRepository = new BlogsQueryRepository();
        this.blogsRepository = new BlogsRepository();
        this.postsQueryRepository = new PostsQueryRepository();
        this.blogsService = new BlogsService();
        this.postService = new PostsService();
    }

    async getAllBlogs(req: RequestWithSearchTerms<QueryBlogRequestType>, res: Response) {

        const sortData: SortBlogRepositoryType = {
            sortBy: req.query.sortBy || "createdAt",
            sortDirection: req.query.sortDirection === "asc" ? 1 : -1,
            pageNumber: req.query.pageNumber || 1,
            pageSize: req.query.pageSize || 10
        }
        const searchData: SearchBlogRepositoryType = {
            searchNameTerm: req.query.searchNameTerm || null
        }

        const blogs = await this.blogsQueryRepository.getAllBlogs(sortData, searchData);
        if (!blogs) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return
        }
        res.status(HTTP_STATUSES.OK_200).json(blogs);
    }

    async getBlogById(req: RequestWithParams<Params>, res: Response) {
        const blog = await this.blogsQueryRepository.getBlogById(req.params.id);
        if (blog) {
            res.status(HTTP_STATUSES.OK_200).json(blog);
            return
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }

    async getAllPosts(req: RequestWithSearchTermsAndParams<Params, QueryPostRequestType>, res: Response) {

        const sortData: SortPostRepositoryType = {
            sortBy: req.query.sortBy || "createdAt",
            sortDirection: req.query.sortDirection || "desc",
            pageNumber: req.query.pageNumber || 1,
            pageSize: req.query.pageSize || 10
        }

        const posts = await this.postsQueryRepository.getAllPosts(sortData, req.params.id,);
        if (posts.items.length < 1) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.status(HTTP_STATUSES.OK_200).json(posts);
    }

    async createBlog(req: RequestWithBody<CreateBlogDto>, res: Response) {
        const creatData = req.body;

        const newBlog = await this.blogsService.createNewBlog(creatData);
        if (newBlog) {
            res.status(HTTP_STATUSES.CREATED_201).json(newBlog);
            return
        }
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    async createPost(req: RequestWithBodyAndParams<Params, PostReqBodyCreateType>, res: Response) {

        const blogId = req.params.id;
        const createData = req.body;

        const createdPost = await this.postService.createNewPost(createData, blogId);

        if (!createdPost) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.status(HTTP_STATUSES.CREATED_201).json(createdPost)
    }

    async updateBlog(req: RequestWithBodyAndParams<Params, UpdateBlogDto>, res: Response) {
        const updateData = req.body;
        const isUpdated = await this.blogsService.updateBlog(req.params.id, updateData);
        if (isUpdated) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
            return
        }
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }

    async deleteBlog(req: RequestWithParams<Params>, res: Response) {
        const isDeleted = await this.blogsRepository.deleteBlog(req.params.id);
        if (isDeleted) res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        else res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
}
