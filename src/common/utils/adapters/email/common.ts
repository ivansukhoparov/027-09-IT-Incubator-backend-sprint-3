import dotenv from "dotenv";
import {emailLogin, emailPassword} from "../../../../utils/comon";

dotenv.config();

export const emailFrom = {
    registrationService: '"no-reply bloggers platform" <sukhoparov.ivan@gmail.com>',
    passwordRecoveryService: '"no-reply bloggers platform" <no-reply@bggpf.com>'
}

export const transporterOption = {
    service: "gmail",
    auth: {
        user: emailLogin,
        pass: emailPassword
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    },
}
