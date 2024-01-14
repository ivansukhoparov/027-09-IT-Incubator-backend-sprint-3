import {WithId} from "mongodb";
import {SecurityDevicesOutput, SecuritySessionType} from "./output";

export const securityMapper = (session:WithId<SecuritySessionType>):SecurityDevicesOutput=>{
    return {
        deviceId: session.deviceId,
        ip: session.ip,
        lastActiveDate: new Date(session.lastActiveDate).toISOString(),
        title: session.deviceTitle


    }
}
