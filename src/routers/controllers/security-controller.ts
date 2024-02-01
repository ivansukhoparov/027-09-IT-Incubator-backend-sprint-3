import {Request, Response} from "express";
import {Tokens} from "../../common/utils/tokens";
import {HTTP_STATUSES} from "../../utils/comon";
import {SecurityQueryRepository} from "../../repositories/security-query-repository";
import {Params, RequestWithParams} from "../../types/common";
import {SecurityService} from "../../domains/security-service";
import {securityRouter} from "../security-router";

export class SecurityController{
    private securityQueryRepository: SecurityQueryRepository;
    private securityService: SecurityService;

    constructor() {
        this.securityQueryRepository = new SecurityQueryRepository();
        this.securityService = new SecurityService();
    }


     async getDevices(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    const isValid = await  Tokens.verifyRefreshToken(refreshToken);
    if (!isValid) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    return;
}
const decodedToken = Tokens.decodeRefreshToken(refreshToken);

const sessions = await this.securityQueryRepository.getSessionByUserId(decodedToken!.userId)
res.status(HTTP_STATUSES.OK_200).json(sessions);
}


async terminateDevice(req: RequestWithParams<Params>, res: Response)  {
    const refreshToken = req.cookies.refreshToken;
    const isValid = await Tokens.verifyRefreshToken(refreshToken);
    if (!isValid) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
    const isSession = await this.securityQueryRepository.getSessionByDeviceId(req.params.id)
    if (!isSession) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    const isDeleted = await this.securityService.terminateAuthSession(refreshToken, req.params.id)
    if (!isDeleted) {
        res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
        return;
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
}

 async terminateAllDevices(req: RequestWithParams<Params>, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    const isValid = await Tokens.verifyRefreshToken(refreshToken);
    if (!isValid) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }

    await this.securityService.terminateOtherAuthSessions(refreshToken)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
}

}
