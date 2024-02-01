import {UserOutputAuthType} from "../types/users/output";
import {UsersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {AuthOutputType} from "../types/auth/otput";
import {UserService} from "./user-service";
import {EmailAdapter} from "../common/utils/adapters/email/email-adapter";
import {add} from "date-fns/add";
import {btoa} from "buffer";
import {v4 as uuidv4} from "uuid";
import {RefreshTokenRepository} from "../repositories/refresh-token-repository";
import {Tokens} from "../common/utils/tokens";
import {SecurityService} from "./security-service";
import {PasswordRecoveryRequestType} from "../types/auth/input";
import {Password} from "../common/utils/password";

dotenv.config();

const secretKey = {
    accessToken: process.env.ACCESS_TOKEN_SECRET_KEY!,
    refreshToken: process.env.ACCESS_TOKEN_SECRET_KEY!
};

export class AuthService {
    private refreshTokenRepository: RefreshTokenRepository;
    private usersRepository: UsersRepository;
    private securityService: SecurityService;

    constructor() {
        this.refreshTokenRepository = new RefreshTokenRepository();
        this.usersRepository = new UsersRepository();
        this.securityService = new  SecurityService();
    }

    async loginUser(loginOrEmail: string, password: string, deviceTitle: string, ip:string): Promise<AuthOutputType | null> {

        const user:UserOutputAuthType|null = await this.usersRepository.getUserByLoginOrEmail(loginOrEmail);
        if (!user) return null;

        const isSuccess = await bcrypt.compare(password, user.hash);
        if (!isSuccess) return null;

        const deviceId = uuidv4();

        const tokens = this._getTokens(user.id, deviceId);

        const sessionIsCreate = await this.securityService.createAuthSession(tokens.refreshToken,deviceTitle,ip);
        if (!sessionIsCreate) return null;
        return tokens;
    }
     async killTokens(oldRefreshToken: string): Promise<boolean> {
        const isVerified = await Tokens.verifyRefreshToken(oldRefreshToken);
        if (!isVerified) return false;

        return this.refreshTokenRepository.addToBlackList(oldRefreshToken);
    }
     async refreshTokens(oldRefreshToken: string): Promise<AuthOutputType|null> {
        const isVerified = await Tokens.verifyRefreshToken(oldRefreshToken);
        if (!isVerified) return null;

        await this.refreshTokenRepository.addToBlackList(oldRefreshToken);

        const decodedToken = Tokens.decodeRefreshToken(oldRefreshToken);
        if (!decodedToken) return null;

        const tokens = this._getTokens(decodedToken.userId, decodedToken.deviceId);
        const isSessionUpdate = await this.securityService.updateAuthSession(tokens.refreshToken);
        if (!isSessionUpdate) return null;

        return tokens;
    }
     async getUserIdByToken(token:string):Promise<string|null>{
        try {
            const result:any = jwt.verify(token, secretKey.accessToken);
            return result.userId
        }catch (err){
            return null
        }
    }

     async registerUser(login: string, email: string, password: string) {

        await UserService.createUser(login, email, password);
        const createdUser = await this.usersRepository.getUserByLoginOrEmail(email);
        if (!createdUser) return false;
        const isEmailSent = await EmailAdapter.sendEmailConfirmationEmail(createdUser);
        if (!isEmailSent) {
            await this.usersRepository.deleteUser(createdUser.id);
            return false;
        }
        return true;
    }
     async refreshEmailConfirmationCode(email: string) {
        const newConfirmationCode = this._createConfirmationCode(email);
        const isUserUpdated = await UserService.updateUserEmailConfirmationCode( email, newConfirmationCode);
        if (!isUserUpdated) return false;
        const user = await this.usersRepository.getUserByCustomKey("email", email);
        if (!user) return false;
        return await EmailAdapter.reSendEmailConfirmationEmail(user);
    }
     async confirmEmail(confirmationCode: string) {

        const receiptedCode = this._confirmationCodeToData(confirmationCode);
        if (!receiptedCode) return false;

        const user = await this.usersRepository.getUserByLoginOrEmail(receiptedCode.userEmail)

        if (!user) return false;
        if (user.emailConfirmation.isConfirmed) return false;
        if (confirmationCode !== user.emailConfirmation.confirmationCode) return false;

        const userCode = this._confirmationCodeToData(user.emailConfirmation.confirmationCode);

        if (receiptedCode.expirationDate < new Date().toISOString()) return false;

        const isConfirmed = await UserService.updateUserEmailConfirmationStatus(user.id);

        return isConfirmed;
    }

     async passwordRecoveryCode(email: string) {
        // Check email is exist
        const user = await this.usersRepository.getUserByLoginOrEmail(email);
        if (!user) return;

        // Create recovery code and write down it to db with email and user id
        const recoveryCode = this._createRecoveryCode(user.id);

        // Send email with recovery code
        const isEmailSend: boolean = await EmailAdapter.sendPasswordRecoveryCode(user, recoveryCode);
        return;
    }

     async setNewPassword({newPassword, recoveryCode}:PasswordRecoveryRequestType){
        const isVerified = await Tokens.verifyPasswordRecoveryToken(recoveryCode);
        if (!isVerified) return false;

        const userId = await Tokens.decodePasswordRecoveryToken(recoveryCode)
        if (!userId) return false;

        const newPasswordHash = await Password.getNewHash(newPassword);
        const isUpdated = await this.usersRepository.updateUserPasswordHash(userId,newPasswordHash);

        return isUpdated

    }

     _confirmationCodeToData(code: string) {
        try{
            const mappedCode = code.split(":").map(el => atob(el));
            return {
                confirmationCode: mappedCode[0],
                userEmail: mappedCode[1],
                expirationDate: mappedCode[2]
            }
        } catch (err){
            return null
        }
    }
     _createConfirmationCode(email: string, lifeTime: {} = {hours: 48}) {
        const confirmationCodeExpiration = add(new Date, lifeTime).toISOString()
        return `${btoa(uuidv4())}:${btoa(email)}:${btoa(confirmationCodeExpiration)}`
    }

     _createRecoveryCode(userId: string) {
        return Tokens.createPasswordRecoveryToken(userId)
    }
     _getTokens(userId: string, deviceId: string): AuthOutputType {
        const accessToken = Tokens.createAccessToken(userId);
        const refreshToken = Tokens.createRefreshToken(userId, deviceId);
        return {accessToken, refreshToken};
    }

}
