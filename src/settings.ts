
const defaultSettings = {
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
}

const testSettings:typeof defaultSettings = {
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
}

export const settings = defaultSettings;
