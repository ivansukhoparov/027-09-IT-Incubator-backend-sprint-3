import {Request, Response} from "express";
import {AuthService} from "../../domains/auth-service";
import {HTTP_STATUSES} from "../../utils/comon";
import {SecurityService} from "../../domains/security-service";

import {RequestWithBody} from "../../types/common";
import {
    EmailConfirmationCodeResendRequestType,
    EmailConfirmationCodeType,
    PasswordRecoveryRequestType,
    RegistrationInfoType
} from "../../types/auth/input";

import {inject, injectable} from "inversify";


@injectable()
export class AuthController{
    constructor(@inject(AuthService) protected authService: AuthService,
                @inject(AuthService) protected securityService: SecurityService) {
    }

    async getMe(req: Request, res: Response) {
    const user = {
        login: req.user!.login,
        email: req.user!.email,
        userId: req.user!.id
    }
    res.status(HTTP_STATUSES.OK_200).json(user);
}


async login (req: Request ,res: Response)  {
    const deviceTitle = req.header("user-agent")?.split(" ")[1] || "unknown"
    const ip = req.ip || "unknown"

    const isLoggedIn = await this.authService.loginUser(req.body.loginOrEmail, req.body.password, deviceTitle, ip);

    if (!isLoggedIn) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    return
}
res.cookie('refreshToken', isLoggedIn.refreshToken, {httpOnly: true, secure: true})
res.status(HTTP_STATUSES.OK_200).json({accessToken: isLoggedIn.accessToken});
}


    async logout (req: Request, res: Response) {
        const tokens = await this.authService.killTokens(req.cookies.refreshToken);
        if (!tokens) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return
        }
        await this.securityService.terminateCurrentSession(req.cookies.refreshToken);
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }


    async refreshToken (req: Request, res: Response)  {
        const tokens = await this.authService.refreshTokens(req.cookies.refreshToken);
        if (!tokens) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }
        res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true, secure: true});
        res.status(HTTP_STATUSES.OK_200).json({accessToken: tokens.accessToken});
    }



    async registration (req: RequestWithBody<RegistrationInfoType>, res: Response)  {

        const isSuccessful = await this.authService.registerUser(req.body.login, req.body.email, req.body.password);
        if (!isSuccessful) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
            return;
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }


    async registrationConfirmation (req: RequestWithBody<EmailConfirmationCodeType>, res: Response)  {
        const isConfirm = await this.authService.confirmEmail(req.body.code);
        if (!isConfirm) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
                errorsMessages: [{
                    message: "Invalid code or expiration date expired",
                    field: "code"
                }]
            });
            return;
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }


    async registrationEmailResending(req: RequestWithBody<EmailConfirmationCodeResendRequestType>, res: Response)  {

        const isSendNewCode = await this.authService.refreshEmailConfirmationCode(req.body.email);
        if (!isSendNewCode) {
            res.status(HTTP_STATUSES.SERVER_ERROR_500);
            return;
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);

    }

    async passwordRecovery (req: Request, res: Response)  {
        await this.authService.passwordRecoveryCode(req.body.email)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }



    async newPassword (req: RequestWithBody<PasswordRecoveryRequestType>, res: Response)  {
        const {newPassword, recoveryCode} = req.body;
        const result = await this.authService.setNewPassword({newPassword, recoveryCode});
        if (!result) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
                errorsMessages: [{
                    message: "Invalid code or expiration date expired",
                    field: "recoveryCode"
                }]
            });
            return;
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);

    }

}
