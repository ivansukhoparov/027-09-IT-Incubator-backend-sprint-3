export type SecurityDevicesOutput = {
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
}


export type SecuritySessionType = {
    sessionId:string
    userId:string
    deviceId: string
    deviceTitle: string
    ip: string
    lastActiveDate: string
    refreshToken:{
        createdAt:string;
        expiredAt:string
    }
}


export type ApiRequestType = {
    ip:string
    url:string
    date:Date
}
