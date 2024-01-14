import {SecurityDevicesOutput} from "../types/security/output";
import {securityCollection} from "../db/db-collections";
import {securityMapper} from "../types/security/mapper";


export class SecurityQueryRepository {
    static async getSessionByUserId(userId: string): Promise<SecurityDevicesOutput[]> {
        const sessions =  await securityCollection.find({userId:userId}).toArray();
        return sessions.map(securityMapper);
    }
}
