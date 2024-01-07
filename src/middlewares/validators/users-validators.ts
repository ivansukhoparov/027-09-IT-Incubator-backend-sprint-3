import {body} from "express-validator"


const validateLogin = body("login").trim().isString().notEmpty().isLength({min: 3, max: 10}).matches(new RegExp("^[a-zA-Z0-9_-]*$"));
const validateEmail = body("email").trim().notEmpty().isString().isEmail();
const validatePassword = body("password").trim().isString().notEmpty().isLength({min: 6, max: 20})

export const usersValidationChain = ()=>[validateLogin,validateEmail,validatePassword];
