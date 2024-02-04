import dotenv from "dotenv";
dotenv.config();

const defaultSettings = {
	env: {
		mongoUri: "mongodb://0.0.0.0:27017",
		mongoDbName: "bloggers-platform",
		port: 5001,
		emailLogin: process.env.EMAIL_LOGIN!,
		emailPassword: process.env.EMAIL_PASSWORD!,
	},
	cors:{
		options:{}
	},
	refreshToken:{
		expiredIn:"30d"
	},
	accessToken:{
		expiredIn:"30m"
	},
	recoveryToken:{
		expiredIn:"24h"
	},
	requestLimit:{
		interval: 10, // interval in seconds
		count:5 // count of requests in interval
	},
};

const testSettings:typeof defaultSettings = {
	env: {
		mongoUri: "mongodb://0.0.0.0:27017",
		mongoDbName: "bloggers-platform",
		port: 5001,
		emailLogin: process.env.EMAIL_LOGIN!,
		emailPassword: process.env.EMAIL_PASSWORD!,
	},
	cors:{
		options:{origin:"http://localhost:3001",
			optionsSuccessStatus: 200,
			credentials: true,
		}
	},
	refreshToken:{
		expiredIn:"30d"
	},
	accessToken:{
		expiredIn:"1h"
	},
	recoveryToken:{
		expiredIn:"24h"
	},
	requestLimit:{
		interval: 10, // interval in seconds
		count:5 // count of requests in interval
	}
};

export const settings = defaultSettings;
