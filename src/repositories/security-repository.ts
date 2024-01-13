import {SecurityDevicesOutput, SecuritySessionType, SecuritySessionUpdateType} from "../types/security/output";
import {securityCollection} from "../db/db-collections";
import {securityMapper} from "../types/security/mapper";


export class SecurityRepository {
    static async createNewSession(sessionData: SecuritySessionType) {
        const isCreated = await securityCollection.insertOne(sessionData);
        return isCreated.insertedId.toString()
    }

    static async updateSession(deviceId: string, updateData: SecuritySessionUpdateType) {
        const isUpdated = await securityCollection.updateOne({deviceId: deviceId},
            {
                $set: {
                    lastActiveDate: updateData.lastActiveDate,
                    "refreshToken.createdAt": updateData.refreshToken.createdAt,
                    "refreshToken.expiredAt": updateData.refreshToken.expiredAt
                }
            })
        return !!isUpdated.matchedCount
    }

}
