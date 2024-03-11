import {WithId} from "mongodb";
import {NewestLikeType, PostDtoType, PostLikeDto, PostOutputType, PostsLikesInfoType} from "./output";


export const postMapper = (post: WithId<PostDtoType>, likes: PostsLikesInfoType):PostOutputType  => {
	return {
		id: post._id.toString(),
		title: post.title,
		shortDescription: post.shortDescription,
		content: post.content,
		blogId: post.blogId,
		blogName: post.blogName,
		createdAt: post.createdAt,
		extendedLikesInfo: likes
	};
};

export const postLikesMapper =(like:WithId<PostLikeDto>):NewestLikeType=>{
	return{
		addedAt: like.addedAt,
		userId: like.likedUserId,
		login: like.likedUserName
	};
};
