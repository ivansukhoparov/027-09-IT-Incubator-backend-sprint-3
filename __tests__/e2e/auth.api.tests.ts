import request = require("supertest");
import {app} from "../../src/app";
import {ErrorsMessageType, ErrorType} from "../../src/types/common";
import {UsersRepository} from "../../src/repositories/users-repository";
import {AuthService} from "../../src/domains/auth-service";
import {usersCollection} from "../../src/db/db-collections";

const routers = {
    main: "/auth",
    registration: "/auth/registration/",
    confirmation: "/auth/registration-confirmation",
    resend: "/auth/registration-email-resending"
}

/*
const createRouters = (main: string, ...seconds: any) => {
    const routers: {} = seconds.map((el: any) => el.toString()).reduce((acc: {}, el: string) => {
        acc[el] = "/" + el;
        return acc
    }, {main: "/" + main});
    return routers
}
*/

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

const invalidConfirmation = {
    request: {code: "lrjavjlrbpiaeruvblaerhvblrhvblerhvbaerjibvlarhebvlhbevlhbvr"},
    responseCode: 400,
    response: createErrorMessages("code")
}
const validConfirmation = {
    responseCode: 204,
    response: {}
}

const testDataUsers = {
    valid_1: {
        request: {
            "login": "vaniko",
            "password": "qweasd",
            "email": "rbcdaaa@gmail.com"
        },
        response: {},
        responseCode: 204,
        confirmationCode_1: {code:""},
        confirmationCode_2:{code:""},
        isConfirmed:false,
    },
    valid_2: {
        request: {
            "login": "vaniko2",
            "password": "qweasdw",
            "email": "79117917524@yandex.ru"
        },
        response: {},
        responseCode: 204,
        confirmationCode_1:{code:""},
        confirmationCode_2:{code:""},
        isConfirmed:false,
    },
    emptyFields: {
        request: {
            "login": "",
            "password": "",
            "email": ""
        },
        response: createErrorMessages("login", "email", "password"),
        responseCode: 400
    },
    emptyRequest: {
        request: {},
        response: createErrorMessages("login", "email", "password"),
        responseCode: 400
    },
    longFields: {
        request: {
            "login": "123456789011",
            "password": "123456789012345678901",
            "email": "rbcdaaa@gmail.com"
        },
        response: createErrorMessages("login", "password"),
        responseCode: 400
    },
    shortFields: {
        request: {
            "login": "a1",
            "password": "qwerq",
            "email": "rbcdaaa@gmail.com"
        },
        response: createErrorMessages("login", "password"),
        responseCode: 400
    },
    notEmailField: {
        request: {
            "login": "vaniko",
            "password": "qweasd",
            "email": "www.fra.sdd"
        },
        response: createErrorMessages("email"),
        responseCode: 400
    },
    alreadyExistLogin: {
        request: {
            "login": "vaniko",
            "password": "qweasd",
            "email": "79117917524@yandex.ru"
        },
        response: createErrorMessages("login"),
        responseCode: 400
    },
    alreadyExistEmail: {
        request: {
            "login": "vaniko1",
            "password": "qweasd",
            "email": "rbcdaaa@gmail.com"
        },
        response: createErrorMessages("email"),
        responseCode: 400
    },
}


describe(routers.main, () => {

    beforeAll(async () => {
        // Delete add data before tests
        await request(app).delete("/testing/all-data");
    });


    it(" - user registration with empty request should return 400 and errors messages", async () => {
        const res = await request(app).post(routers.registration).
    send(testDataUsers.emptyRequest.request).
    expect(testDataUsers.emptyRequest.responseCode);

    expect(res.body).toEqual(testDataUsers.emptyRequest.response);
    })

    it (" - user registration with empty fields should return 400 and errors messages", async () =>{
        const res = await request(app).post(routers.registration).
        send(testDataUsers.emptyFields.request).
        expect(testDataUsers.emptyFields.responseCode);

        expect(res.body).toEqual(testDataUsers.emptyFields.response);
    })

    it (" - user registration with too long login and email should return 400 and errors messages", async () =>{
        const res = await request(app).post(routers.registration).
        send(testDataUsers.longFields.request).
        expect(testDataUsers.longFields.responseCode);

        expect(res.body).toEqual(testDataUsers.longFields.response);
    })

    it (" - user registration with too short login and email  data should return 400 and errors messages", async () =>{
        const res = await request(app).post(routers.registration).
        send(testDataUsers.shortFields.request).
        expect(testDataUsers.shortFields.responseCode);

        expect(res.body).toEqual(testDataUsers.shortFields.response);
    })

    it (" - user registration with invalid email  data should return 400 and errors messages", async () =>{
        const res = await request(app).post(routers.registration).
        send(testDataUsers.notEmailField.request).
        expect(testDataUsers.notEmailField.responseCode);

        expect(res.body).toEqual(testDataUsers.notEmailField.response);
    })

    it (" + user registration with valid request should return 204 and code to email", async () =>{
        const res = await request(app).post(routers.registration).
        send(testDataUsers.valid_1.request).
        expect(testDataUsers.valid_1.responseCode);

        expect(res.body).toEqual(testDataUsers.valid_1.response);
        const user_1 = await UsersRepository.getUserByLoginOrEmail(testDataUsers.valid_1.request.login)
        expect(user_1).not.toBeNull()
        testDataUsers.valid_1.confirmationCode_1 = {code: user_1!.emailConfirmation.confirmationCode};
        expect(user_1!.emailConfirmation.isConfirmed).toBe(false);

    })

    it(" + user registration of second user with valid request should return 204 and code to email", async () => {
        const res = await request(app).post(routers.registration).
        send(testDataUsers.valid_2.request).
        expect(testDataUsers.valid_2.responseCode);

        expect(res.body).toEqual(testDataUsers.valid_2.response);
        const user_2 = await UsersRepository.getUserByLoginOrEmail(testDataUsers.valid_2.request.login)
        expect(user_2).not.toBeNull()
        testDataUsers.valid_2.confirmationCode_1 = {code: user_2!.emailConfirmation.confirmationCode};
        expect(user_2!.emailConfirmation.isConfirmed).toBe(false);

    })

    it (" - user registration with existing login should return 400 and errors messages", async () =>{
        const res = await request(app).post(routers.registration).
        send(testDataUsers.alreadyExistLogin.request).
        expect(testDataUsers.alreadyExistLogin.responseCode);

        expect(res.body).toEqual(testDataUsers.alreadyExistLogin.response);
    })

    it (" - user registration with existing email should return 400 and errors messages", async () =>{
        const res = await request(app).post(routers.registration).
        send(testDataUsers.alreadyExistEmail.request).
        expect(testDataUsers.alreadyExistEmail.responseCode);

        expect(res.body).toEqual(testDataUsers.alreadyExistEmail.response);
    })

    it(" - confirmation with invalid code for user_1 must return 400 and error message", async () => {
        const res = await request(app).post(routers.confirmation).send(invalidConfirmation.request).expect(invalidConfirmation.responseCode);

        expect(res.body).toEqual(invalidConfirmation.response);
    })

    it(" + confirmation with valid code for user_1 must return 204 and empty body", async () => {
        const res = await request(app).post(routers.confirmation).send(testDataUsers.valid_1.confirmationCode_1).expect(validConfirmation.responseCode);

        expect(res.body).toEqual(validConfirmation.response);

        const user_1 = await UsersRepository.getUserByLoginOrEmail(testDataUsers.valid_1.request.login);
        expect(user_1!.emailConfirmation.isConfirmed).toBe(true);

    })

    it(" - confirmation with valid code for confirmed user_1 must return 400 and error message", async () => {
        const res = await request(app).post(routers.confirmation).send(testDataUsers.valid_1.confirmationCode_1).expect(invalidConfirmation.responseCode);

        expect(res.body).toEqual(invalidConfirmation.response);
    })

    it(" - confirmation with expired valid code for confirmed user_2 must return 400 and error message", async () => {
        // create new confirmation code with living time 1 sec
        const newCode = AuthService._createConfirmationCode(testDataUsers.valid_2.request.email, {seconds: 1});

        // write it to db
        await usersCollection.updateOne({login: testDataUsers.valid_2.request.login}, {$set: {"emailConfirmation.confirmationCode": newCode}});

        //await 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));

        const res = await request(app)
            .post(routers.confirmation)
            .send({code: newCode})
            .expect(invalidConfirmation.responseCode);

        expect(res.body).toEqual(invalidConfirmation.response);
    })

    it(" - request to resend code with invalid data must return 400 and error message", async () => {
        const res = await request(app).post(routers.resend).send({email: "12345"}).expect(400);
        expect(res.body).toEqual(createErrorMessages("email"));
    })

    it(" - request to resend code with not registered email must return 400 and error message", async () => {
        const res = await request(app).post(routers.resend).send({email: "gggg@gmail.gom"}).expect(400);
        expect(res.body).toEqual(createErrorMessages("email"));
    })
    it(" - request to resend code for confirmed user must return 400 and error message", async () => {
        const res = await request(app).post(routers.resend).send({email: testDataUsers.valid_1.request.email}).expect(400);
        expect(res.body).toEqual(createErrorMessages("email"));
    })

    it(" + request with valid data and for not confined user must return 204 and update code in db", async () => {
        const res = await request(app).post(routers.resend).send({email: testDataUsers.valid_2.request.email}).expect(204);

        expect(res.body).toEqual({});
        const user_2 = await UsersRepository.getUserByLoginOrEmail(testDataUsers.valid_2.request.login)
        expect(user_2).not.toBeNull()
        testDataUsers.valid_2.confirmationCode_2 = {code: user_2!.emailConfirmation.confirmationCode};
        expect(user_2!.emailConfirmation.isConfirmed).toBe(false);

    })

    /*
    it(" - user can't login without email confirmation (user_2)", async () => {

     })
     it(" + user can login with email confirmation (user_1)", async () => {

     })
     */

    it(" + confirmation with resent code for user_2 must return 204 and empty body", async () => {
        const res = await request(app).post(routers.confirmation).send(testDataUsers.valid_2.confirmationCode_2).expect(validConfirmation.responseCode);

        expect(res.body).toEqual(validConfirmation.response);

        const user_2 = await UsersRepository.getUserByLoginOrEmail(testDataUsers.valid_2.request.login);
        expect(user_2!.emailConfirmation.isConfirmed).toBe(true);

    })

})
