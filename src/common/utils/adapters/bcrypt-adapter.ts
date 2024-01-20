import bcrypt from "bcrypt";


export class BcryptAdapter {
    static async createHash (string:string){
        return await bcrypt.hash(string, 10);
    }
}
