import dotenv from "dotenv";
dotenv.config();

import {app} from "./app";
import {runDB} from "./db/db";
import {settings} from "./settings";

app.set('trust proxy', true);
const appStart = async () => {
    await runDB();

    app.listen(settings.env.port, async () => {
        console.log(`app start on port ${settings.env.port}`);
        console.log(`open in browser http://localhost:${settings.env.port}`);
    })
}

appStart();
