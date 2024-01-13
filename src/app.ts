import express, {Request, Response} from "express";
import {videosRouter} from "./routers/videos-router";
import {testingRouter} from "./routers/testing-router";
import {blogsRouter} from "./routers/blogs-router";
import {postsRouter} from "./routers/posts-router";
import {authRouter} from "./routers/auth-router";
import {usersRouter} from "./routers/users-router";
import {commentsRouter} from "./routers/comments-router";
import cookieParser from "cookie-parser";
import cors from "cors";
import {settings} from "./settings";
import {ApiRequestsRepository} from "./repositories/api-requests-repository";
import {apiRequestLimitMiddleware} from "./middlewares/security/api-request-limit-middleware";
export const app = express();

app.use(express.json());
app.use(cors(settings.cors.options));
app.use(cookieParser());
app.use(apiRequestLimitMiddleware);

app.use("/testing", testingRouter);

app.use("/videos", videosRouter);
app.use("/blogs", blogsRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/comments", commentsRouter);
