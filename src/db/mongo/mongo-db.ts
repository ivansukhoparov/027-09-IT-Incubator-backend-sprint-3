import {MongoClient} from "mongodb";
import {settings} from "../../settings";


export const db = {
	client: new MongoClient(settings.env.mongoUri),

	async run() {
		try {
			console.log(settings.env.mongoUri);
			console.log("client", this.client);
			// Connect to server
			await this.client.connect();
			console.log("connect");
			// Check connection
			await this.client.db("admin").command({ping: 1});
			console.log("Mongo server connection successful");
			console.log("DB connected to " + settings.env.mongoUri);
			return true;
		} catch {
			await this.client.close();
			console.log("Mongo server connection failed");
			return false;
		}
	}
};
