import {WithId} from "mongodb";
import {SecurityDevicesOutput, SecuritySessionType} from "./output";

export const securityMapper = (session:WithId<SecuritySessionType>):SecurityDevicesOutput=>{
    return {
        ip: session.ip,
        title: session.deviceTitle,
        lastActiveDate: session.lastActiveDate,
        deviceId: session.deviceId
    }
}
