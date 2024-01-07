import {refreshTokensCollection} from "../db/db-collections";

export class RefreshTokenRepository {

    static async addToken(token:string){
        const isSuccess = await refreshTokensCollection.insertOne({token:token});
        return !!isSuccess;
    }

    static async checkToken(token:string){
        const isExist = await refreshTokensCollection.findOne({token:token});
        return !!isExist
    }
}

