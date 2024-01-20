import {UserOutputType, UserType} from "../types/users/output";
import {usersCollection} from "../db/db-collections";
import {ObjectId} from "mongodb";
import {userMapper, userMapperAuth} from "../types/users/mapper";


export class UsersRepository {

    static async getUserById(id: string): Promise<UserOutputType | null> {
        try {
            const user = await usersCollection.findOne({_id: new ObjectId(id)});
            if (!user) return null;
            return userMapper(user);
        } catch (err) {
            return null;
        }
    }

    static async getUserByLoginOrEmail(loginOrEmail: string) {
        try {
            const searchKey = {$or: [{login: loginOrEmail}, {email: loginOrEmail}]};
            const user = await usersCollection.findOne(searchKey);
            if (!user) return null;

            return userMapperAuth(user);

        } catch (err) {
            return null;
        }
    }

    static async getUserByCustomKey(filterKey: string, filterValue: string) {
        try {
            let filter = {};
            if (filterKey === "id") filter = {_id: new ObjectId(filterValue)};
            else filter = {[filterKey]: filterValue};

            const user = await usersCollection.findOne(filter);
            if (!user) return null;
            return userMapperAuth(user);
        } catch (err) {
            return null;
        }
    }



    static async updateUserCustomFields(filterKey: string, filterValue: string, updateData: UserType) {
        try {
            let filter = {};
            if (filterKey === "id") filter = {_id: new ObjectId(filterValue)};
            else filter = {[filterKey]: filterValue};

            const isUpdated = await usersCollection.updateOne({filter}, {$set: updateData});
            return isUpdated.matchedCount === 1;
        } catch (err) {
            return false
        }
    }

    static async updateUserPasswordHash (userId:string,newHash:string){
        try{
            const isUpdated = await usersCollection.updateOne(
                {_id:new ObjectId(userId)},
                {$set:{hash:newHash}});
            return isUpdated.matchedCount === 1;
        }catch (err){
            return false
        }
    }

    static async createUser(createData: UserType): Promise<string | null> {
        try {
            const result = await usersCollection.insertOne(createData);
            return result.insertedId.toString();
        } catch (err) {
            return null
        }
    }

    static async deleteUser(id: string) {
        try {
            const result = await usersCollection.deleteOne({_id: new ObjectId(id)});
            return result.deletedCount === 1;
        } catch (err) {
            return false
        }
    }
}
