import {apiRequestsCollection} from "../db/db-collections";

export class ApiRequestsRepository {
    static async writeRequest(ip: string, url: string) {
        const result = await apiRequestsCollection.insertOne({
            ip: ip,
            url: url,
            date: new Date()
        })

    }

    static async countRequestByTime(ip: string, url: string, interval: number) {

        const timeCheck = (new Date(Date.now() - (1000 * interval)));

        const searchKey = {
            $and: [
                {ip: ip},
                {url: url},
                {date: {$gte: timeCheck}}
            ]
        };

        return await apiRequestsCollection.countDocuments(searchKey);
    }
}
