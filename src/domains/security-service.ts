import {RefreshToken} from "../common/utils/refresh-token";
import {SecurityRepository} from "../repositories/security-repository";
import {throws} from "assert";
import {SecuritySessionUpdateType} from "../types/security/output";
import {securityCollection} from "../db/db-collections";
import {SecurityQueryRepository} from "../repositories/security-query-repository";
import {compareSync} from "bcrypt";

export class SecurityService {
    static async createAuthSession(refreshToken: string, deviceTitle: string, ip: string): Promise<boolean> {

        const decodedToken = RefreshToken.decode(refreshToken);
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

        await SecurityRepository.createNewSession(newSession);
        return true
    }

    static async updateAuthSession(refreshToken: string): Promise<boolean> {

        const decodedToken = RefreshToken.decode(refreshToken);
        if (!decodedToken) return false

        const updateData:SecuritySessionUpdateType = {
            lastActiveDate: decodedToken.iat,
            refreshToken: {
                createdAt: decodedToken.iat,
                expiredAt: decodedToken.exp,
            }
        }

        return SecurityRepository.updateSession(decodedToken.deviceId, updateData);
    }

    static async terminateAuthSession(refreshToken:string, deviceId: string){
        const decodedToken = RefreshToken.decode(refreshToken);
        const session = await SecurityRepository.getSessionByDeviceId(deviceId);
        if (decodedToken?.userId!==session?.userId){
            return false;
        }
        return  SecurityRepository.deleteSession(deviceId);
    }

    static async terminateCurrentSession(refreshToken:string){
        const decodedToken = RefreshToken.decode(refreshToken);
        const session = await SecurityRepository.getSessionByDeviceId(decodedToken!.deviceId);
        if (decodedToken?.userId!==session?.userId){
            return false;
        }
        return  SecurityRepository.deleteSession(decodedToken!.deviceId);
    }

    static async terminateOtherAuthSessions(refreshToken:string){
        const decodedToken = RefreshToken.decode(refreshToken);
        return await SecurityRepository.deleteSessionsExpectCurrent(decodedToken!.userId,decodedToken!.deviceId)
    }
}
