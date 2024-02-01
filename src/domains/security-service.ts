import {Tokens} from "../common/utils/tokens";
import {SecurityRepository} from "../repositories/security-repository";
import {SecuritySessionUpdateType} from "../types/security/output";

export class SecurityService {
    constructor(protected securityRepository: SecurityRepository) {
    }

     async createAuthSession(refreshToken: string, deviceTitle: string, ip: string): Promise<boolean> {

        const decodedToken = Tokens.decodeRefreshToken(refreshToken);
        if (!decodedToken) return false

        const newSession = {
            userId: decodedToken.userId,
            deviceId: decodedToken.deviceId,
            deviceTitle: deviceTitle,
            ip: ip,
            lastActiveDate: decodedToken.iat,
            refreshToken: {
                createdAt: decodedToken.iat,
                expiredAt: decodedToken.exp,
            }
        }

        await this.securityRepository.createNewSession(newSession);
        return true
    }

      async updateAuthSession(refreshToken: string): Promise<boolean> {

        const decodedToken = Tokens.decodeRefreshToken(refreshToken);
        if (!decodedToken) return false

        const updateData:SecuritySessionUpdateType = {
            lastActiveDate: decodedToken.iat,
            refreshToken: {
                createdAt: decodedToken.iat,
                expiredAt: decodedToken.exp,
            }
        }

        return this.securityRepository.updateSession(decodedToken.deviceId, updateData);
    }

      async terminateAuthSession(refreshToken:string, deviceId: string){
        const decodedToken = Tokens.decodeRefreshToken(refreshToken);
        const session = await this.securityRepository.getSessionByDeviceId(deviceId);
        if (decodedToken?.userId!==session?.userId){
            return false;
        }
        return  this.securityRepository.deleteSession(deviceId);
    }

      async terminateCurrentSession(refreshToken:string){
        const decodedToken = Tokens.decodeRefreshToken(refreshToken);
        const session = await this.securityRepository.getSessionByDeviceId(decodedToken!.deviceId);
        if (decodedToken?.userId!==session?.userId){
            return false;
        }
        return  this.securityRepository.deleteSession(decodedToken!.deviceId);
    }

      async terminateOtherAuthSessions(refreshToken:string){
        const decodedToken = Tokens.decodeRefreshToken(refreshToken);
        return await this.securityRepository.deleteSessionsExpectCurrent(decodedToken!.userId,decodedToken!.deviceId)
    }
}
