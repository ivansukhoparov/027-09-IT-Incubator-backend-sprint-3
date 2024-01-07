
const defaultSettings = {
    cors:{
        options:{}
    }
}

const testSettings:typeof defaultSettings = {
    cors:{
        options:{origin:"http://localhost:3001",
            optionsSuccessStatus: 200,
            credentials: true,
        }
    }
}

export const settings = defaultSettings;
