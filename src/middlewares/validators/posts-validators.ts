import {body} from "express-validator";
import {BlogsQueryRepository} from "../../repositories/blogs-query-repository";


const validatePostTitle = body("title").trim().isString().notEmpty().isLength({min: 1, max: 30});
const validatePostDescription = body("shortDescription").trim().isString().notEmpty().isLength({min: 0, max: 100});
const validatePostContent = body("content").trim().isString().notEmpty().isLength({min: 0, max: 1000});
const validateBlogID = body("blogId").isString().notEmpty().custom(async (value) => {
    const blog = await BlogsQueryRepository.getBlogById(value)
    return blog!.id === value
}).withMessage("Invalid value");

export const validationPostsChains = () => [validatePostTitle, validatePostDescription, validatePostContent, validateBlogID];
export const validationPostsChainsNoBlogId = () => [validatePostTitle, validatePostDescription, validatePostContent];
