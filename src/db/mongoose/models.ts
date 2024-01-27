import mongoose from "mongoose";
import {blogSchema} from "./schemas";

export const BlogModel = mongoose.model("blogs", blogSchema);
