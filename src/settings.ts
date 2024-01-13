
const defaultSettings = {
    cors:{
        options:{}
    },

    refreshToken:{
        expiredIn:"20s"
    },

    accessToken:{
        expiredIn:"10s"
    },

    requestLimit:{
        interval: 10, // interval in seconds
        count:5 // count of requests in interval
    }
}

const testSettings:typeof defaultSettings = {
    cors:{
        options:{origin:"http://localhost:3001",
            optionsSuccessStatus: 200,
            credentials: true,
        }
    },

    refreshToken:{
        expiredIn:"200s"
    },

    accessToken:{
        expiredIn:"100s"
    },

    requestLimit:{
        interval: 10, // interval in seconds
        count:5 // count of requests in interval
    }

}

export const settings = defaultSettings;
