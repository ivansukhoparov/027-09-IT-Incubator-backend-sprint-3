import {MongoClient} from "mongodb";
import {mongoUri} from "../utils/comon";
import mongoose from "mongoose";


export const client = new MongoClient(mongoUri)



export const runDB = async () => {
    try {
        // Connect to server
        await client.connect();
        // Check connection
        await client.db("admin").command({ping: 1});
        console.log("Mongo server connection successful");
        console.log("DB connected to " + mongoUri);
    }catch  {
        await client.close()
        console.log("Mongo server connection failed")
    }
}

