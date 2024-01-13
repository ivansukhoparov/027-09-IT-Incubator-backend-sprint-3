import jwt from "jsonwebtoken";

export class JwtToken {
    static create = (payload: {}, options: {}, secretKey: string) => {
        return jwt.sign(payload, secretKey, options);
    }

    static verify = (token: string, secretKey: string) => {
        try {
            jwt.verify(token, secretKey);
            return true;
        } catch (err) {
            return false;
        }
    }

    static decode = (token: string) => {
        return jwt.decode(token);
    }

}
