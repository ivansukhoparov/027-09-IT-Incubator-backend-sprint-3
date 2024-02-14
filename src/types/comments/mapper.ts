import {WithId} from "mongodb";
import {CommentType, LikesInfoType, OutputCommentType} from "./output";

export const commentMapper=(input:WithId<CommentType>, likes:LikesInfoType):OutputCommentType=>{
	return {
		id: input._id.toString(),
		content: input.content,
		commentatorInfo: {
			userId: input.commentatorInfo.userId,
			userLogin: input.commentatorInfo.userLogin
		},
		createdAt: input.createdAt,
		likesInfo:likes
	};
};
