import {SecurityDevicesOutput} from "../types/security/output";
import {securityCollection} from "../db/mongo/mongo-collections";
import {securityMapper} from "../types/security/mapper";
import {injectable} from "inversify";

@injectable()
export class SecurityQueryRepository {
     async getSessionByUserId(userId: string): Promise<SecurityDevicesOutput[]> {
        const sessions =  await securityCollection.find({userId:userId}).toArray();
        return sessions.map(securityMapper);
    }

     async getSessionByDeviceId(deviceId: string) {
        const session =  await securityCollection.findOne({deviceId:deviceId});
        if (!session){
            return null
        }
        return securityMapper(session);
    }
}
