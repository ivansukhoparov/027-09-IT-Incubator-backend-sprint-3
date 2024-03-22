import {db} from "./mongo/mongo-db";
import {runMongoose} from "./mongoose/mongoose";

export const connectDb = async () => {
	const mongo = await db.run();
	//const mongoose = await runMongoose();
	return mongo;// && mongoose;
};
