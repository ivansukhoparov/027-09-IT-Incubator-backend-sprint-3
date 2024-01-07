import {body} from "express-validator";

const validateBlogName = body("name").trim().isString().notEmpty().isLength({min: 1, max: 15});
const validateBlogDescription =  body("description").trim().isString().notEmpty().isLength({min: 0, max: 500});
const validateBlogUrl = body("websiteUrl").isString().notEmpty().isURL().isLength({min: 10, max: 100});

export const validationBlogsChains =()=> [validateBlogName,validateBlogDescription,validateBlogUrl]
