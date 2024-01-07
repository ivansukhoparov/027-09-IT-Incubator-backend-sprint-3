import {WithId} from "mongodb";
import {UserOutputAuthType, UserOutputType, UserType} from "./output";

export const userMapper = (user: WithId<UserType>): UserOutputType => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}

export const userMapperAuth = (user: WithId<UserType>): UserOutputAuthType => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
        hash:user.hash,
        emailConfirmation:{
            confirmationCode:user.emailConfirmation.confirmationCode,
            isConfirmed:user.emailConfirmation.isConfirmed
        }
    }
}
