import {MongoClient} from "mongodb";
import mongoose from "mongoose";
import {settings} from "../settings";


export const client = new MongoClient(settings.env.mongoUri)



export const runDB = async () => {
    try {
        // Connect to server
        await client.connect();
        // Check connection
        await client.db("admin").command({ping: 1});
        console.log("Mongo server connection successful");
        console.log("DB connected to " + settings.env.mongoUri);
    }catch  {
        await client.close()
        console.log("Mongo server connection failed")
    }
}

