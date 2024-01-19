import nodemailer from "nodemailer";
import {emailFrom, transporterOption} from "./common";
import {EmailMessage} from "../../../../types/email/input";
import {UserOutputAuthType} from "../../../../types/users/output";
import {emailManager} from "./email-manager";

export class EmailAdapter {
    static async sendEmailConfirmationEmail(user: UserOutputAuthType) {
        return await this._sendEmail(user.email, emailFrom.registrationService,
            emailManager.confirmationEmail(user.emailConfirmation.confirmationCode,user.email));
    }

    static async reSendEmailConfirmationEmail(user: UserOutputAuthType) {
        return await this._sendEmail(user.email, emailFrom.registrationService,
            emailManager.reConfirmationEmail(user.emailConfirmation.confirmationCode,user.email));
    }

    static async sendPasswordRecoveryCode(user: UserOutputAuthType, recoveryCode:string) {
        return await this._sendEmail(user.email, emailFrom.passwordRecoveryService,
            emailManager.resetPassword(recoveryCode));
    }

    static async _sendEmail(mailTo: string, sendFrom: string, emailMessage: EmailMessage) {
        try {
            const transporter = nodemailer.createTransport(transporterOption);
            const sentEmailInfo = await transporter.sendMail(
                {
                    ...emailMessage,
                    from: sendFrom,
                    to: mailTo,
                });
            //  console.log("email sent");
            //  console.log(sentEmailInfo);
            return true;
        } catch (err) {
            //   console.log("email don't sent");
            //   console.log(err);
            return false;
        }

    }
}











