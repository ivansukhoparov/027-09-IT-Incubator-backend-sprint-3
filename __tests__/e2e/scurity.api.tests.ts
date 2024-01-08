import request from "supertest"
import {app} from "../../src/app";
import {HTTP_STATUSES} from "../../src/utils/comon";
import {ErrorsMessageType, ErrorType} from "../../src/types/common";

/*
Создаем пользователя, логиним пользователя 4 раза с разныными user-agent;
Делаем проверки на ошибки 404, 401, 403;
Обновляем refreshToken девайса 1;
Запрашиваем список девайсов с обновленным токеном. Количество девайсов и deviceId  всех девайсов не должны измениться. LastActiveDate девайса 1 должна измениться;
Удаляем девайс 2 (передаем refreshToken девайса 1). Запрашиваем список девайсов. Проверяем, что девайс 2 отсутствует в списке;
Делаем logout девайсом 3. Запрашиваем список девайсов (девайсом 1).  В списке не должно быть девайса 3;
Удаляем все оставшиеся девайсы (девайсом 1).  Запрашиваем список девайсов. В списке должен содержаться только один (текущий) девайс;
Пишем дополнительные тесты для проверки логика работы с девайсами.*/

const routers = {
    main: "/security",
    devices: "/devices/"
};

const createErrorMessages = (...fields: any) => {
    const errors: ErrorType = {errorsMessages: []}
    fields.forEach((field: any) => {
        const errorsMessage: ErrorsMessageType = {
            message: expect.any(String),
            field: field.toString()
        };
        errors.errorsMessages.push(errorsMessage);
    })
    return errors;
}

const userData = {
    login: "user1",
    email: "qwe123@gmail.com",
    password: "qwerty"
};
const devices = ["iphone10", "windows10", "Xiaomi8", "nokia112"]

type DeviceType = {
    refreshToken: ""
    accessToken: ""
}

type userTokens = {}
const signedInDevices: any = {}
describe(routers.main, () => {

    beforeAll(async () => {
        // Delete add data before tests
        await request(app).delete("/testing/all-data");

        //create user
        const res = await request(app).post("/users").auth("admin", "qwerty")
            .send(userData)
            .expect(HTTP_STATUSES.CREATED_201);

        // login user from difference devices
        for (let i = 0; i < devices.length; i++) {
            const res = await request(app)
                .post("/auth/login")
                .set("User-Agent", devices[i])
                .send({
                    loginOrEmail: userData.login,
                    password: userData.password
                });
           // const refreshToken = res.headers["set-cookie"].toString().replace("refreshToken=", "")
            const refreshToken = res.header.cookies.refreshToken
            signedInDevices["device_"+i] = {
                accessToken: res.body.accessToken,
                refreshToken: refreshToken,
                device: devices[i]
            }
        }
console.log(signedInDevices)
    });


    it(" - user registration with empty request should return 400 and errors messages", async () => {
        expect(1).toBe(1)
    })


})
