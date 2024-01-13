export type RefreshTokenDBType = {
    token: string
}

export type RefreshTokenPayloadType = {
    userId: string
    deviceId:string
    iat:number
    exp:number
}
