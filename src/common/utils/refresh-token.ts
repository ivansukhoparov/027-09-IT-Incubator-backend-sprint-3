import {JwtToken} from "./adapters/jwt-tokens";
import {settings} from "../../settings";
import {RefreshTokenRepository} from "../../repositories/refresh-token-repository";


const secretKeyRefreshToken = process.env.REFRESH_TOKEN_SECRET_KEY!;


export class RefreshToken {
    static create = (userId: string, deviceId: string,
                     expiresIn: string = settings.refreshToken.expiredIn,
                     secretKey: string = secretKeyRefreshToken) => {

        return JwtToken.create({userId: userId, deviceId: deviceId}, {expiresIn: expiresIn}, secretKey);
    };

    static verify = async (token: string, secretKey: string = secretKeyRefreshToken) => {
        const isInBlackList = await RefreshTokenRepository.checkToken(token);
        if (isInBlackList) {
            return false;
        }
        return JwtToken.verify(token, secretKey);
    }

    static decode = (token: string) => {
        return JwtToken.decode(token);
    }
}
