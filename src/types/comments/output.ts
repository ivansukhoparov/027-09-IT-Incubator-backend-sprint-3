import {InputCommentLikesType, LikeStatusType} from "./input";

export type OutputCommentType = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string
    likesInfo: LikesInfoType
}

export type LikesInfoType = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatusType
}



export type CommentType = {
    content: string
    postId:string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string
}

export type CommentLikeDTO = {
    commentId: string
    likedUserId: string
    status: LikeStatusType
}
