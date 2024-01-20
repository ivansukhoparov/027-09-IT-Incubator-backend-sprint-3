import {BcryptAdapter} from "./adapters/bcrypt-adapter";

export class Password {
    static async getNewHash (password:string){
        return await BcryptAdapter.createHash(password);
    }
}
