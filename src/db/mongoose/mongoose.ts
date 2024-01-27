import mongoose from "mongoose";
import {settings} from "../../settings";


export const runMongoose = async ()=>{
    try{
        await mongoose.connect(settings.env.mongoUri+"/"+settings.env.mongoDbName);
        console.log("Mongoose connection successful");
        console.log("Mongoose connected to" + settings.env.mongoUri +"/"+settings.env.emailLogin);
        return true;
    }catch {
        await mongoose.disconnect();
        console.log("Mongoose connection failed");
        return false;
    }
}
