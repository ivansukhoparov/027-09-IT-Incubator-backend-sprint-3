import {UserOutputType, UserType} from "../types/users/output";
import {UsersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt";
import {usersCollection} from "../db/db-collections";
import {ObjectId} from "mongodb";
import {AuthService} from "./auth-service";
import {UserUpdateType} from "../types/users/input";

export class UsersDomain {
    static async createUser(login: string, email: string, password: string, isConfirmed:boolean = false): Promise<UserOutputType | null> {
        const createdAt = new Date().toISOString();
        const hash = await bcrypt.hash(password, 10);

        const newUser: UserType = {
            login: login,
            email: email,
            hash: hash,
            createdAt: createdAt,
            emailConfirmation: {
                confirmationCode: AuthService._createConfirmationCode(email),
                isConfirmed: isConfirmed
            }
        }

        const newUserId = await UsersRepository.createUser(newUser);
        if (!newUserId) return null;

        const createdUser = await UsersRepository.getUserById(newUserId);
        if (!createdUser) return null;

        return createdUser;
    }

    static async updateUserEmailConfirmationStatus (userId:string){
       try {
            const isUpdated = await usersCollection.updateOne({_id: new ObjectId(userId)}, {$set: {"emailConfirmation.isConfirmed": true}});
            return isUpdated.matchedCount===1;
        }catch (err){
           return false
       }
    }

    static async updateUserEmailConfirmationCode (email:string, code:string){
        try {
            const isUpdated = await usersCollection.updateOne({email: email}, {$set: {"emailConfirmation.confirmationCode": code}});
            return isUpdated.matchedCount===1;
        }catch (err){
            return false
        }
    }

    static async updateUserCustomFields(filterKey: string, filterValue: string, updateData: UserUpdateType) {
        const user = await UsersRepository.getUserByCustomKey(filterKey, filterValue);
        if (!user) return false;
        const newData: UserType = {
            ...user,
            ...updateData,
            emailConfirmation: {
                ...user.emailConfirmation,
                ...updateData.emailConfirmation
            }
        }

        const isUpdated = await UsersRepository.updateUserCustomFields(filterKey, filterValue, newData);
        return isUpdated
    }
}
