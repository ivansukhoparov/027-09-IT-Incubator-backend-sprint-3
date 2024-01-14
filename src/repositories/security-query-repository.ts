import {SecurityDevicesOutput} from "../types/security/output";
import {securityCollection} from "../db/db-collections";
import {securityMapper} from "../types/security/mapper";


export class SecurityQueryRepository {
    static async getSessionByUserId(userId: string): Promise<SecurityDevicesOutput[]> {
        const sessions =  await securityCollection.find({userId:userId}).toArray();
        return sessions.map(securityMapper);
    }

    static async getSessionByDeviceId(deviceId: string) {
        const session =  await securityCollection.findOne({deviceId:deviceId});
        if (!session){
            return null
        }
        return securityMapper(session);
    }
}
