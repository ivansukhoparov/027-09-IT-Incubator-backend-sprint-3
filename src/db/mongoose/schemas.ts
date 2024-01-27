import mongoose, {Schema} from "mongoose";
import {BlogType} from "../../types/blogs/output";
import {CommentType} from "../../types/comments/output";
import {PostType} from "../../types/posts/output";
import {RefreshTokenPayloadType} from "../../types/refresh-token/output";
import {UserType} from "../../types/users/output";
import {ApiRequestType, SecuritySessionType} from "../../types/security/output";
import {dbBlogs} from "../mongo/mongo-collections";


export const userSchema = new   mongoose.Schema<UserType>({
    login: {type:String, required:true},
    email: {type:String, required:true},
    hash: String,
    createdAt: Date,
    emailConfirmation:{
        confirmationCode:String,
        isConfirmed:{type:String, default:false},
    }
})

export const blogSchema = new mongoose.Schema<BlogType>({
    name: {type:String, required:true},
    description: {type:String, required:true},
    websiteUrl: {type:String, required:true},
    createdAt: Date,
    isMembership: {type:Boolean, default:false}
});

export const postSchema = new mongoose.Schema<PostType>({
    title: {type:String, required:true},
    shortDescription: {type:String, required:true},
    content: {type:String, required:true},
    blogId: {type:String, required:true},
    blogName: String,
    createdAt: Date
})

export const commentSchema = new mongoose.Schema<CommentType>({
    content: {type:String, required:true},
    postId:{type:String, required:true},
    commentatorInfo: {
        userId: {type:String, required:true},
        userLogin: {type:String, required:true},
    },
    createdAt: Date
})

export const refreshTokenSchema =new mongoose.Schema<RefreshTokenPayloadType>({
    userId: {type:String, required:true},
    deviceId:{type:String, required:true},
    iat:{type:Number, required:true},
    exp:{type:Number, required:true},
})

export const securitySchema = new mongoose.Schema<SecuritySessionType>({
    userId:{type:String, required:true},
    deviceId: {type:String, required:true},
    deviceTitle: {type:String, required:true},
    ip: {type:String, required:true},
    lastActiveDate: Date,
    refreshToken:{
        createdAt:{type:Number, required:true},
        expiredAt:{type:Number, required:true},
    }
})

export const apiRequestSchema= new mongoose.Schema<ApiRequestType>({
    ip:String,
    url:String,
    date:Date,
})
