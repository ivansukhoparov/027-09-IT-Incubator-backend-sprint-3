import {refreshTokensCollection} from "../db/mongo/mongo-collections";

export class RefreshTokenRepository {

    static async addToBlackList(token:string){
        const isSuccess = await refreshTokensCollection.insertOne({token:token});
        return !!isSuccess;
    }

    static async checkToken(token:string){
        const isExist = await refreshTokensCollection.findOne({token:token});
        return !!isExist
    }
}

