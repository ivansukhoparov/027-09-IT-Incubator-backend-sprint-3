import {Router, Request, Response} from "express";
import {AuthorizationMiddleware} from "../middlewares/auth/auth-middleware";
import {HTTP_STATUSES} from "../utils/comon";
import {SecurityQueryRepository} from "../repositories/security-query-repository";
import {AuthService} from "../domains/auth-service";
import {RefreshToken} from "../common/utils/refresh-token";

export const securityRouter = Router()

securityRouter.get("/devices", async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const isValid = await  RefreshToken.verify(refreshToken);
    if (!isValid) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
    const decodedToken = RefreshToken.decode(refreshToken);

    const sessions = await SecurityQueryRepository.getSessionByUserId(decodedToken?.userId)
    res.status(HTTP_STATUSES.OK_200).json(sessions);
})
