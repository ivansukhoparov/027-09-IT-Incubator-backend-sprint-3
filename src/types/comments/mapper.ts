import {WithId} from "mongodb";
import {CommentType, OutputCommentType} from "./output";

export const commentMapper=(input:WithId<CommentType>):OutputCommentType=>{
	return {
		id: input._id.toString(),
		content: input.content,
		commentatorInfo: {
			userId: input.commentatorInfo.userId,
			userLogin: input.commentatorInfo.userLogin
		},
		createdAt: input.createdAt
	};
};
