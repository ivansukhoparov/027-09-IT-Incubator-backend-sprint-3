import request from "supertest";


export const testingUserCreate = async (testData: any, app:any) => {
	await request(app).post("/users/").auth("admin", "qwerty")
		.send(testData.req)
		.expect(testData.resCode)
		.then(res => {
			expect(res.body).toEqual(testData.res);
		});
};
