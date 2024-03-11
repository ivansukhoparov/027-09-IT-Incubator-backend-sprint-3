import {LikeStatusType} from "../comments/input";

export type PostOutputType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    extendedLikesInfo:PostsLikesInfoType
}

export type NewestLikeType = {
    addedAt: string
    userId: string
    login: string
}

export type PostsLikesInfoType = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatusType
    newestLikes: Array<NewestLikeType>
}



export type PostDtoType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type PostLikeDto = {
    postId: string
    likedUserId: string
    likedUserName: string
    addedAt:string
    status: LikeStatusType
}
