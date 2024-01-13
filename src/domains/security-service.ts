import {RefreshToken} from "../common/utils/refresh-token";
import {SecurityRepository} from "../repositories/security-repository";
import {throws} from "assert";
import {SecuritySessionUpdateType} from "../types/security/output";
import {securityCollection} from "../db/db-collections";

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

        await SecurityRepository.updateSession(decodedToken.deviceId, updateData);
        return true
    }

}
