import {body} from "express-validator";

const loginOrEmailValidation = body("loginOrEmail").trim().isString().notEmpty();
const passwordValidation = body("password").trim().isString().notEmpty();

export const loginValidationChain = ()=>[loginOrEmailValidation,passwordValidation];
