import {Request, Response, Router} from "express";
import {RequestWithBody} from "../types/common";
import {
    EmailConfirmationCodeResendRequestType,
    EmailConfirmationCodeType,
    PasswordRecoveryRequestType,
    RegistrationInfoType
} from "../types/auth/input";
import {AuthService} from "../domains/auth-service";
import {HTTP_STATUSES} from "../utils/comon";
import {
    emailValidator,
    loginValidationChain,
    newPasswordValidation
} from "../middlewares/validators/auth-validators";
import {inputValidationMiddleware} from "../middlewares/validators/input-validation-middleware";
import {AuthorizationMiddleware} from "../middlewares/auth/auth-middleware";
import {
    isEmailConfirmed,
    registrationValidationChain,
    uniqueLoginOrEmail
} from "../middlewares/validators/registration-validator";
import {SecurityService} from "../domains/security-service";
import {AuthController} from "./controllers/auth-controller";
import {container} from "../composition-root";

export const authRouter=Router();

const authControllerInstance = container.resolve<AuthController>(AuthController);
authRouter.get("/me",
    AuthorizationMiddleware,
    authControllerInstance.getMe.bind(authControllerInstance))

authRouter.post("/login",
    loginValidationChain(),
    inputValidationMiddleware,
    authControllerInstance.login.bind(authControllerInstance))

authRouter.post("/logout",
    authControllerInstance.logout.bind(authControllerInstance))


authRouter.post("/refresh-token",
    authControllerInstance.refreshToken.bind(authControllerInstance))


authRouter.post("/registration",
    registrationValidationChain(),
    uniqueLoginOrEmail,
    inputValidationMiddleware,
    authControllerInstance.registration.bind(authControllerInstance))

authRouter.post("/registration-confirmation",
    authControllerInstance.registrationConfirmation.bind(authControllerInstance))

authRouter.post("/registration-email-resending",
    isEmailConfirmed,
    authControllerInstance.registrationEmailResending.bind(authControllerInstance))

authRouter.post("/password-recovery",
    emailValidator,
    inputValidationMiddleware,
    authControllerInstance.passwordRecovery.bind(authControllerInstance))


authRouter.post("/new-password",
    newPasswordValidation,
    inputValidationMiddleware,
    authControllerInstance.newPassword.bind(authControllerInstance) )
