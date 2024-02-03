import "reflect-metadata"
import {ApiRequestsRepository} from "./repositories/api-requests-repository";
import {BlogsQueryRepository} from "./repositories/blogs-query-repository";
import {BlogsRepository} from "./repositories/blogs-repository";
import {CommentsQueryRepository} from "./repositories/comments-query-repository";
import {CommentsRepository} from "./repositories/comments-repository";
import {PostsQueryRepository} from "./repositories/posts-query-repository";
import {PostsRepository} from "./repositories/posts-repository";
import {UsersRepository} from "./repositories/users-repository";
import {UsersQueryRepository} from "./repositories/users-query-repository";
import {RefreshTokenRepository} from "./repositories/refresh-token-repository";
import {SecurityQueryRepository} from "./repositories/security-query-repository";
import {SecurityRepository} from "./repositories/security-repository";
import {AuthService} from "./domains/auth-service";
import {UserService} from "./domains/user-service";
import {SecurityService} from "./domains/security-service";
import {BlogsService} from "./domains/blogs-service";
import {PostsService} from "./domains/posts-service";
import {CommentsService} from "./domains/comments-service";
import {Container} from "inversify";

// const container = new Container();


const apiRequestRepository = new ApiRequestsRepository();
const blogQueryRepository = new BlogsQueryRepository();
const blogRepository = new BlogsRepository();
const commentsQueryRepository = new CommentsQueryRepository();
const commentsRepository = new CommentsRepository();
const postsQueryRepository = new PostsQueryRepository();
const postsRepository = new PostsRepository();
const usersQueryRepository = new UsersQueryRepository();
const usersRepository = new UsersRepository();
const refreshTokenRepository = new RefreshTokenRepository();
const securityQueryRepository = new SecurityQueryRepository();
const securityRepository = new SecurityRepository();

const userService = new UserService(usersRepository);
const blogsService = new BlogsService(blogRepository);
const postService = new PostsService(postsRepository,blogRepository);
const commentService = new CommentsService(commentsRepository,commentsQueryRepository)
const securityService = new SecurityService(securityRepository);
const authService = new AuthService(refreshTokenRepository,usersRepository,securityService,userService);

