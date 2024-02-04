import {JwtToken} from "./adapters/jwt-tokens";
import {settings} from "../../settings";


const secretKeyAccessToken = process.env.ACCESS_TOKEN_SECRET_KEY!;


export class AccessToken {
	static create = (userId: string,
		expiresIn: string = settings.refreshToken.expiredIn,
		secretKey: string = secretKeyAccessToken) => {

		return JwtToken.create({userId: userId}, {expiresIn: expiresIn}, secretKey);
	};
}

