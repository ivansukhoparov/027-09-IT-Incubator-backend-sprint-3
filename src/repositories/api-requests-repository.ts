import {apiRequestsCollection} from "../db/mongo/mongo-collections";
import {injectable} from "inversify";

@injectable()
export class ApiRequestsRepository {
	async writeRequest(ip: string, url: string) {
		const result = await apiRequestsCollection.insertOne({
			ip: ip,
			url: url,
			date: new Date()
		});
	}

	async countRequestByTime(ip: string, url: string, interval: number) {

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
