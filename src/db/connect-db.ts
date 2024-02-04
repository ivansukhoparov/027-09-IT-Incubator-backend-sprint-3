import {runMongoDb} from "./mongo/mongo-db";
import {runMongoose} from "./mongoose/mongoose";

export const connectDb = async () => {
	const mongo = await runMongoDb();
	const mongoose = await runMongoose();
	return mongo && mongoose;
};
