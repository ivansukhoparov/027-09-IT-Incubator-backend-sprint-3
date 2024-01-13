export type SecurityDevicesOutput = {
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
}


export type SecuritySessionType = {
    userId:string
    deviceId: string
    deviceTitle: string
    ip: string
    lastActiveDate: number
    refreshToken:{
        createdAt:number
        expiredAt:number
    }
}

export type SecuritySessionUpdateType = {
    lastActiveDate: number
    refreshToken:{
        createdAt:number
        expiredAt:number
    }
}

export type ApiRequestType = {
    ip:string
    url:string
    date:Date
}
