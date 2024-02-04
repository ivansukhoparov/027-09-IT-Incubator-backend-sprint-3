import {JwtToken} from "./adapters/jwt-tokens";
import {settings} from "../../settings";
import {RefreshTokenRepository} from "../../repositories/refresh-token-repository";
import {RefreshTokenPayloadType} from "../../types/refresh-token/output";
import {AccessTokenPayloadType} from "../../types/access-token/output";
import {add} from "date-fns/add";
import {btoa} from "buffer";
import {v4 as uuidv4} from "uuid";


const secretKeyRefreshToken = process.env.REFRESH_TOKEN_SECRET_KEY!;
const secretKeyAccessToken = process.env.ACCESS_TOKEN_SECRET_KEY!;
const secretKeyRecoveryToken = process.env.PASS_RECOVERY_TOKEN_SECRET_KEY!;

const refreshTokenRepository = new RefreshTokenRepository();

export class Tokens {

	// Refresh token
	static createRefreshToken = (userId: string, deviceId: string,
		expiresIn: string = settings.refreshToken.expiredIn,
		secretKey: string = secretKeyRefreshToken) => {

		return JwtToken.create({userId: userId, deviceId: deviceId}, {expiresIn: expiresIn}, secretKey);
	};
	static verifyRefreshToken = async (token: string,
		secretKey: string = secretKeyRefreshToken) => {
		const isInBlackList = await refreshTokenRepository.checkToken(token);
		if (isInBlackList) {
			return false;
		}
		return JwtToken.verify(token, secretKey);
	};
	static decodeRefreshToken = (token: string): RefreshTokenPayloadType | null => {
		try {
			const decodedToken: any = JwtToken.decode(token);
			return {
				userId: decodedToken.userId,
				deviceId: decodedToken.deviceId,
				iat: decodedToken.iat,
				exp: decodedToken.exp
			};
		} catch (err) {
			return null;
		}
	};



	// Access token
	static createAccessToken = (userId: string,
		expiresIn: string = settings.accessToken.expiredIn,
		secretKey: string = secretKeyAccessToken) => {

		return JwtToken.create({userId: userId}, {expiresIn: expiresIn}, secretKey);

	};
	static verifyAccessToken = async (token: string,
		secretKey: string = secretKeyRefreshToken) => {
		return JwtToken.verify(token, secretKey);
	};
	static decodeAccessToken = (token: string): AccessTokenPayloadType | null => {
		try {
			const decodedToken: any = JwtToken.decode(token);
			return {
				userId: decodedToken.userId,
				iat: decodedToken.iat,
				exp: decodedToken.exp
			};
		} catch (err) {
			return null;
		}
	};

	static createEmailConfirmationCode(email: string, lifeTime: {} = {hours: 48}) {
		const confirmationCodeExpiration = add(new Date, lifeTime).toISOString();
		return `${btoa(uuidv4())}:${btoa(email)}:${btoa(confirmationCodeExpiration)}`;
	}

	// Password recovery token
	static createPasswordRecoveryToken = (userId: string,
		expiresIn: string = settings.accessToken.expiredIn,
		secretKey: string = secretKeyRecoveryToken) => {

		return JwtToken.create({userId: userId}, {expiresIn: expiresIn}, secretKey);

	};
	static verifyPasswordRecoveryToken = async (token: string,
		secretKey: string = secretKeyRecoveryToken) => {
		return JwtToken.verify(token, secretKey);
	};

	static decodePasswordRecoveryToken = async (token: string):Promise<string|null> => {
		try {
			const decodedToken: any = JwtToken.decode(token);
			return decodedToken.userId;
		} catch (err) {
			return null;
		}
	};
}
