import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../utils/comon";
import {SecurityQueryRepository} from "../repositories/security-query-repository";
import {Tokens} from "../common/utils/tokens";
import {Params, RequestWithParams} from "../types/common";
import {SecurityService} from "../domains/security-service";

export const securityRouter = Router()

securityRouter.get("/devices", async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const isValid = await  Tokens.verifyRefreshToken(refreshToken);
    if (!isValid) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
    const decodedToken = Tokens.decodeRefreshToken(refreshToken);

    const sessions = await SecurityQueryRepository.getSessionByUserId(decodedToken!.userId)
    res.status(HTTP_STATUSES.OK_200).json(sessions);
})

securityRouter.delete("/devices/:id", async (req: RequestWithParams<Params>, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const isValid = await Tokens.verifyRefreshToken(refreshToken);
    if (!isValid) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
    const isSession = await SecurityQueryRepository.getSessionByDeviceId(req.params.id)
    if (!isSession) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    const isDeleted = await SecurityService.terminateAuthSession(refreshToken, req.params.id)
    if (!isDeleted) {
        res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
        return;
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
})

securityRouter.delete("/devices", async (req: RequestWithParams<Params>, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const isValid = await Tokens.verifyRefreshToken(refreshToken);
    if (!isValid) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }

    await SecurityService.terminateOtherAuthSessions(refreshToken)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
})
