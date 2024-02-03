import {UserOutputType, UserType} from "../types/users/output";
import {UsersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt";
import {usersCollection} from "../db/mongo/mongo-collections";
import {ObjectId} from "mongodb";
import {Tokens} from "../common/utils/tokens";
import {injectable} from "inversify";
@injectable()
export class UserService {
    constructor(protected usersRepository: UsersRepository) {
    }

       async createUser(login: string, email: string, password: string, isConfirmed:boolean = false): Promise<UserOutputType | null> {
        const createdAt = new Date().toISOString();
        const hash = await bcrypt.hash(password, 10);

        const newUser: UserType = {
            login: login,
            email: email,
            hash: hash,
            createdAt: createdAt,
            emailConfirmation: {
                confirmationCode: Tokens.createEmailConfirmationCode(email),
                isConfirmed: isConfirmed
            }
        }

        const newUserId = await this.usersRepository .createUser(newUser);
        if (!newUserId) return null;

        const createdUser = await this.usersRepository .getUserById(newUserId);
        if (!createdUser) return null;

        return createdUser;
    }

       async updateUserEmailConfirmationStatus (userId:string){
       try {
            const isUpdated = await usersCollection.updateOne({_id: new ObjectId(userId)}, {$set: {"emailConfirmation.isConfirmed": true}});
            return isUpdated.matchedCount===1;
        }catch (err){
           return false
       }
    }

       async updateUserEmailConfirmationCode (email:string, code:string){
        try {
            const isUpdated = await usersCollection.updateOne(
                {email: email},
                {$set: {"emailConfirmation.confirmationCode": code}});
            return isUpdated.matchedCount===1;
        }catch (err){
            return false
        }
    }

}
