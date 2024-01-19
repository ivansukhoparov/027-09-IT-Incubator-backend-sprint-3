export type AccessTokenDBType = {
    token: string
}

export type AccessTokenPayloadType = {
    userId: string
    iat:number
    exp:number
}
