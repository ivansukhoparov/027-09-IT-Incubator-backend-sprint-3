import request from "supertest";
import {app} from "../../../src/app";

export const testingUserCreate = async (testData: any) => {
	await request(app).post("/users/").auth("admin", "qwerty")
		.send(testData.req)
		.expect(testData.resCode)
		.then(res => {
			expect(res.body).toEqual(testData.res);
		});
};
