import mongoose, {mongo} from "mongoose";
import {
	apiRequestSchema,
	blogSchema,
	commentSchema,
	postSchema,
	refreshTokenSchema,
	securitySchema,
	userSchema
} from "./schemas";
import {BlogType} from "../../types/blogs/output";
import {PostDtoType} from "../../types/posts/output";
import {VideoType} from "../../types/videos/output";
import {UserType} from "../../types/users/output";
import {CommentType} from "../../types/comments/output";
import {RefreshTokenDBType} from "../../types/refresh-token/output";
import {ApiRequestType, SecuritySessionType} from "../../types/security/output";
import {dbBlogs} from "../mongo/mongo-collections";


export const UserModel =mongoose.model("users", userSchema);
export const BlogModel = mongoose.model("blogs", blogSchema);
export const PostModel = mongoose.model("posts",postSchema);
export const CommentsModel = mongoose.model("comments",commentSchema);
export const RefreshTokenModel = mongoose.model("refreshTokens", refreshTokenSchema);
export const ApiRequestModel = mongoose.model("apiRequests", apiRequestSchema);
export const SecurityModel = mongoose.model("security", securitySchema);


