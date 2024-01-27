import mongoose, {Schema} from "mongoose";
import {BlogType} from "../../types/blogs/output";


export const blogSchema = new mongoose.Schema<BlogType>({
    name: {type:String, required:true},
    description: {type:String, required:true},
    websiteUrl: {type:String, required:true},
    createdAt: String,
    isMembership: Boolean
});


