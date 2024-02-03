import "reflect-metadata"
// Repository
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
// Services
import {AuthService} from "./domains/auth-service";
import {UserService} from "./domains/user-service";
import {SecurityService} from "./domains/security-service";
import {BlogsService} from "./domains/blogs-service";
import {PostsService} from "./domains/posts-service";
import {CommentsService} from "./domains/comments-service";



import {Container} from "inversify";
import {AuthController} from "./routers/controllers/auth-controller";
import {BlogController} from "./routers/controllers/blog-controller";
import {CommentsController} from "./routers/controllers/comments-controller";
import {PostsController} from "./routers/controllers/posts-controller";
import {SecurityController} from "./routers/controllers/security-controller";

export const container = new Container();

// Repository
container.bind(ApiRequestsRepository).to(ApiRequestsRepository);
container.bind(BlogsQueryRepository).to(BlogsQueryRepository);
container.bind(BlogsRepository).to(BlogsRepository);
container.bind(CommentsQueryRepository).to(CommentsQueryRepository);
container.bind(CommentsRepository).to(CommentsRepository);
container.bind(PostsQueryRepository).to(PostsQueryRepository);
container.bind(PostsRepository).to(PostsRepository);
container.bind(UsersRepository).to(UsersRepository);
container.bind(UsersQueryRepository).to(UsersQueryRepository);
container.bind(RefreshTokenRepository).to(RefreshTokenRepository);
container.bind(SecurityQueryRepository).to(SecurityQueryRepository);
container.bind(SecurityRepository).to(SecurityRepository);
// Services
container.bind(AuthService).to(AuthService);
container.bind(UserService).to(UserService);
container.bind(SecurityService).to(SecurityService);
container.bind(BlogsService).to(BlogsService);
container.bind(PostsService).to(PostsService);
container.bind(CommentsService).to(CommentsService);
// Controllers
container.bind(AuthController).to(AuthController);
container.bind(BlogController).to(BlogController);
container.bind(CommentsController).to(CommentsController);
container.bind(PostsController).to(PostsController);
container.bind(SecurityController).to(SecurityController);



