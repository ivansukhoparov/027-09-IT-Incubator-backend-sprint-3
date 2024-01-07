import {SearchUsersRepositoryType, SortUsersRepositoryType} from "../types/users/input";
import {usersCollection} from "../db/db-collections";
import {WithId} from "mongodb";
import {UserType} from "../types/users/output";
import {userMapper} from "../types/users/mapper";


export class UsersQueryRepository {

    static async getAllUsers(sortData: SortUsersRepositoryType, searchData: SearchUsersRepositoryType) {

        let sortKey = {};
        let searchKey = {};
        let sortDirection: number;

        // check have search terms create search keys array
        let searchKeysArray:Object[] = [];
        if (searchData.searchLoginTerm) searchKeysArray.push({login: {$regex: searchData.searchLoginTerm, $options: "i"}});
        if (searchData.searchEmailTerm) searchKeysArray.push({email: {$regex: searchData.searchEmailTerm, $options: "i"}});

        if (searchKeysArray.length === 0) {
            searchKey = {};
        } else if (searchKeysArray.length === 1) {
            searchKey = searchKeysArray;
        }else if (searchKeysArray.length > 1) {
            searchKey = {$or: searchKeysArray};
        }
        // calculate limits for DB request
        const documentsTotalCount = await usersCollection.countDocuments(searchKey); // Receive total count of blogs
        const pageCount = Math.ceil(documentsTotalCount / +sortData.pageSize); // Calculate total pages count according to page size
        const skippedDocuments = (+sortData.pageNumber - 1) * +sortData.pageSize; // Calculate count of skipped docs before requested page

        // check if sortDirection is "desc" assign sortDirection value -1, else assign 1
        if (sortData.sortDirection === "desc") sortDirection = -1;
        else sortDirection = 1;

        // check have fields exists assign the same one else assign "createdAt" value
        if (sortData.sortBy === "login") sortKey = {login: sortDirection};
        else if (sortData.sortBy === "email") sortKey = {email: sortDirection};
        else sortKey = {createdAt: sortDirection};

        // Get documents from DB
        const users: WithId<UserType>[] = await usersCollection.find(searchKey).sort(sortKey).skip(+skippedDocuments).limit(+sortData.pageSize).toArray();

        return {
            pagesCount: pageCount,
            page: +sortData.pageNumber,
            pageSize: +sortData.pageSize,
            totalCount: documentsTotalCount,
            items: users.map(userMapper)
        }
    }
}
