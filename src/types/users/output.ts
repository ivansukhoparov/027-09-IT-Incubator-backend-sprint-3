export type UserOutputType = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type UserOutputAuthType = {
    id: string
    login: string
    email: string
    createdAt: string
    hash: string
    emailConfirmation:{
        confirmationCode:string
        isConfirmed:boolean
    }
}

export type UserType = {
    login: string
    email: string
    hash: string
    createdAt: string
    emailConfirmation:{
        confirmationCode:string
        isConfirmed:boolean
    }
}

export type UserOutputMeType = {
    email: string
    login: string
    userId: string
}
