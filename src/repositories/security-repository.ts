import {SecuritySessionType, SecuritySessionUpdateType} from "../types/security/output";
import {securityCollection} from "../db/mongo/mongo-collections";


export class SecurityRepository {
    async createNewSession(sessionData: SecuritySessionType) {
        const isCreated = await securityCollection.insertOne(sessionData);
        return isCreated.insertedId.toString()
    }

    async updateSession(deviceId: string, updateData: SecuritySessionUpdateType) {
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

    async deleteSession(deviceId: string) {
        const isDeleted = await securityCollection.deleteOne({deviceId: deviceId})
        return !!isDeleted.deletedCount
    }

    async getSessionByDeviceId(deviceId: string) {
        return await securityCollection.findOne({deviceId:deviceId});
    }

    async deleteSessionsExpectCurrent(userId: string, deviceId: string) {
        const isDeleted = await securityCollection.deleteMany({$and:[{userId: userId},{deviceId: {$not: {$eq:deviceId}}}]})
    return isDeleted.deletedCount!==0
}
}
