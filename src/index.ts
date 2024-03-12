import dotenv from "dotenv";
import "reflect-metadata";
import {app} from "./app";
import {settings} from "./settings";
import {connectDb} from "./db/connect-db";

dotenv.config();

app.set("trust proxy", true);
const appStart = async () => {
	// connect to DataBase
	console.log("App started at " + (new Date()).toString());
	const dbConnection = await connectDb();
	if (dbConnection) {
		app.listen(settings.env.port, async () => {
			console.log(`app start on port ${settings.env.port}`);
			console.log(`open in browser http://localhost:${settings.env.port}`);
		});
	} else {
		console.log("Data base connection failed at " + (new Date()).toString());
		console.log("App will try restart in 10 seconds");
		await new Promise(resolve => setTimeout(resolve, 10000));
		appStart();
	}
};

appStart();
