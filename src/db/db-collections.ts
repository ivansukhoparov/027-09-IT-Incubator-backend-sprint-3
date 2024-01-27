import {client} from "./db";
import {BlogType} from "../types/blogs/output";
import {PostType} from "../types/posts/output";
import {VideoType} from "../types/videos/output";
import {UserType} from "../types/users/output";
import {CommentType} from "../types/comments/output";
import {RefreshTokenDBType} from "../types/refresh-token/output";
import {ApiRequestType, SecuritySessionType} from "../types/security/output";
import {settings} from "../settings";


export const dbBlogs = client.db(settings.env.mongoDbName);

export const blogCollection = dbBlogs.collection<BlogType>("blogs");
export const postCollection = dbBlogs.collection<PostType>("post");
export const videosCollection = dbBlogs.collection<VideoType>("videos");
export const usersCollection=dbBlogs.collection<UserType>("users");
export const commentsCollection = dbBlogs.collection<CommentType>("comments");
export const refreshTokensCollection = dbBlogs.collection<RefreshTokenDBType>("refreshTokens");

export const apiRequestsCollection = dbBlogs.collection<ApiRequestType>("apiRequestCollection")
export const securityCollection = dbBlogs.collection<SecuritySessionType>("securityCollection")
