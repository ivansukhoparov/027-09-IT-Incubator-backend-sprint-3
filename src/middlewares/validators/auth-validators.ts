import {body} from "express-validator";

const loginOrEmailValidation = body("loginOrEmail").trim().isString().notEmpty();
const passwordValidation = body("password").trim().isString().notEmpty().isLength({min: 6, max: 20});

export const loginValidationChain = ()=>[loginOrEmailValidation,passwordValidation];

export const emailValidator = body("email").trim().notEmpty().isString().isEmail();
export const newPasswordValidation = body("newPassword").trim().isString().notEmpty().isLength({min: 6, max: 20});
