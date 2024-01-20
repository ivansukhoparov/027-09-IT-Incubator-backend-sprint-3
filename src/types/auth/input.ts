export type AuthType = {
    loginOrEmail: string
    password:string
}

export type RegistrationInfoType ={
    "login": string
    "password": string
    "email": string
}

export type EmailConfirmationCodeType = {
    code: string
}

export type EmailConfirmationCodeResendRequestType = {
    email: string
}

export type PasswordRecoveryRequestType = {
    newPassword: string
    recoveryCode: string
}
