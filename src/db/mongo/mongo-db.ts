import {MongoClient} from "mongodb";
import {settings} from "../../settings";

export const client = new MongoClient(settings.env.mongoUri);

export const runMongoDb = async () => {
	try {
		// Connect to server
		await client.connect();
		// Check connection
		await client.db("admin").command({ping: 1});
		console.log("Mongo server connection successful");
		console.log("DB connected to " + settings.env.mongoUri);
		return true;
	}catch  {
		await client.close();
		console.log("Mongo server connection failed");
		return false;
	}
};

