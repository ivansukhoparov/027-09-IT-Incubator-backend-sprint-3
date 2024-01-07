import {app} from "./app";
import {port} from "./utils/comon";
import {runDB} from "./db/db";


const appStart = async () => {
    await runDB();
    app.listen(port, async () => {
        console.log(`app start on port ${port}`);
        console.log(`open in browser http://localhost:${port}`);
    })
}

appStart();
