import "reflect-metadata"
import {UserOutputType, UserType} from "../types/users/output";
import {usersCollection} from "../db/mongo/mongo-collections";
import {ObjectId} from "mongodb";
import {userMapper, userMapperAuth} from "../types/users/mapper";
import {injectable} from "inversify";
import {ERRORS} from "../utils/errors-handler";

@injectable()
export class UsersRepository {

    async getUserById(id: string): Promise<UserOutputType | null> {
        try {
            const user = await usersCollection.findOne({_id: new ObjectId(id)});
            if (!user) return null;
            return userMapper(user);
        } catch (err) {
            return null;
        }
    }

    async getUserByLoginOrEmail(loginOrEmail: string) {
        try {
            const searchKey = {$or: [{login: loginOrEmail}, {email: loginOrEmail}]};
            const user = await usersCollection.findOne(searchKey);
            if (!user) return null;

            return userMapperAuth(user);

        } catch (err) {
            return null;
        }
    }

    async getUserByCustomKey(filterKey: string, filterValue: string) {
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

    async updateUserCustomFields(filterKey: string, filterValue: string, updateData: UserType) {
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

    async updateUserPasswordHash(userId: string, newHash: string) {
        try{
            const isUpdated = await usersCollection.updateOne(
                {_id:new ObjectId(userId)},
                {$set:{hash:newHash}});
            return isUpdated.matchedCount === 1;
        }catch (err){
            return false
        }
    }

    async createUser(createData: UserType): Promise<string> {
            const result = await usersCollection.insertOne(createData);
            return result.insertedId.toString();
    }

    async deleteUser(id: string) {
            const result = await usersCollection.deleteOne({_id: new ObjectId(id)});
            if (result.deletedCount !== 1) throw new Error(ERRORS.NOT_FOUND_404);
    }

}
