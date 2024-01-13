//import request from 'supertest';
import request = require("supertest");
import {app} from "../../src/app";
import {blogCollection} from "../../src/db/db-collections";
import {BlogOutputType} from "../../src/types/blogs/output";


const routerName = "/blogs/";


class Results {
    static emptyBlogs = {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
    }
}

class TestData {
    static emptyFields = {
        "name": "",
        "description": "",
        "websiteUrl": ""
    }
    static overLengthData = {
        "name": "name_16_chars_aa",
        "description": "descrtiption_over_500_chars_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" +
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" +
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" +
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" +
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "websiteUrl": "http://www.test.com"
    }

}

describe(routerName, () => {
    // clear DB before testing
    beforeAll(async () => {
        await request(app).delete("/testing/all-data");
    })


    it(" - should be return 200 and empty array", async () => {
        await request(app).get(routerName).expect(200, Results.emptyBlogs);
    })

    // POST requests ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
    it(" - POST does not create new blog with incorrect data (empty fields)", async () => {
        await request(app).post(routerName)
            .auth("admin", "qwerty")
            .send(TestData.emptyFields)
            .expect(400, {
                errorsMessages: [
                    {message: "Invalid value", field: "name"},
                    {message: "Invalid value", field: "description"},
                    {message: "Invalid value", field: "websiteUrl"}
                ]
            });

        await request(app).get(routerName).expect(200);

    })

    it(" - POST does not create the blog with incorrect data (name and description over length)", async () => {


        await request(app).post(routerName)
            .auth("admin", "qwerty")
            .send(TestData.overLengthData)
            .expect(400, {
                errorsMessages: [
                    {message: "Invalid value", field: "name"},
                    {message: "Invalid value", field: "description"}
                ]
            });

        await request(app).get(routerName).expect(200);

    })

    it(" - POST does not create the blog with incorrect websiteUrl (not url or over length)", async () => {

        await request(app).post(routerName)
            .auth("admin", "qwerty")
            .send({
                "name": "IvansBlog",
                "description": "blog about nothing",
                "websiteUrl": "http://blabla"
            })
            .expect(400, {errorsMessages: [{message: "Invalid value", field: "websiteUrl"}]});

        await request(app).post(routerName)
            .auth("admin", "qwerty")
            .send({
                "name": "IvansBlog",
                "description": "blog about nothing",
                "websiteUrl": "http://www.testaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.com"
            })
            .expect(400, {errorsMessages: [{message: "Invalid value", field: "websiteUrl"}]});

        await request(app).get(routerName).expect(200);

    })

    it(" - POST does not create the blog with invalid authorization", async () => {


        await request(app).post(routerName)
            .auth("odmin", "qwerty")
            .send({
                "name": "Blog 1",
                "description": "blog about nothing",
                "websiteUrl": "http://www.test.com"
            })
            .expect(401);

        await request(app).get(routerName).expect(200);

    })

    let testBlog1: any;
    it(" + POST should be create the blog with correct data", async () => {
        const res = await request(app).post(routerName)
            .auth("admin", "qwerty")
            .send({
                "name": "Blog 1",
                "description": "blog about nothing",
                "websiteUrl": "http://www.test.com"
            })
            .expect(201);

        testBlog1 = res.body;

        await request(app).get(routerName + testBlog1.id).expect(testBlog1);
    })


    it(" - POST should be create the blog with correct data on blogs/id/posts", async () => {

        const res = await request(app).post(routerName + "/" + testBlog1.id + "/posts")
            .auth("admin", "qwerty")
            .send({
                title: "new title",
                shortDescription: "a very short description",
                content: "some content"
            })
            .expect(201);

        const createdPost = res.body

        expect(createdPost.title).toBe("new title");
        expect(createdPost.shortDescription).toBe("a very short description");
        expect(createdPost.content).toBe("some content");
        expect(createdPost.blogId).toBe(testBlog1.id);

    })


    // PUT requests

    it(" - PUT does not update the blog with incorrect data (no name)", async () => {

        // send invalid data

        await request(app).put(routerName + testBlog1.id)
            .auth("admin", "qwerty")
            .send({
                "name": "",
                "description": "blog about nothing and less",
                "websiteUrl": ""
            })
            .expect(400, {
                errorsMessages: [{message: "Invalid value", field: "name"},
                    {message: "Invalid value", field: "websiteUrl"}]
            });

        await request(app).get(routerName + testBlog1.id).expect(testBlog1); // check that the data on the server has not been updated
    })

    it(" - PUT does not update the blog with incorrect data (over length)", async () => {

        // send invalid data

        await request(app).put(routerName + testBlog1.id)
            .auth("admin", "qwerty")
            .send({
                "name": "name_16_chars_aa",
                "description": "descrtiption_over_500_chars_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" +
                    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" +
                    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" +
                    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" +
                    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                "websiteUrl": "http://www.testaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.com"
            })
            .expect(400, {
                errorsMessages: [
                    {message: "Invalid value", field: "name"},
                    {message: "Invalid value", field: "description"},
                    {message: "Invalid value", field: "websiteUrl"}
                ]
            });

        await request(app).get(routerName + testBlog1.id).expect(testBlog1); // check that the data on the server has not been updated
    })

    it(" - PUT does not update the blog with incorrect data (no data but spaces)", async () => {

        // send invalid data

        await request(app).put(routerName + testBlog1.id)
            .auth("admin", "qwerty")
            .send({
                "name": "      ",
                "description": "    ",
                "websiteUrl": "     "
            })
            .expect(400, {
                errorsMessages: [
                    {message: "Invalid value", field: "name"},
                    {message: "Invalid value", field: "description"},
                    {message: "Invalid value", field: "websiteUrl"}
                ]
            });

        await request(app).get(routerName + testBlog1.id).expect(testBlog1); // check that the data on the server has not been updated
    })

    it(" - PUT does not update the blog with invalid authorization", async () => {
        const updateData = {
            "name": "Bloggggg 1",
            "description": "blog about nothing and less",
            "websiteUrl": "http://www.test-123.com"
        }
        // send invalid data
        await request(app).put(routerName + testBlog1.id)
            .auth("odmin", "qwerty")
            .send(updateData)
            .expect(401);

        await request(app).get(routerName + testBlog1.id).expect(testBlog1); // check that the data on the server has not been updated
    })

    it(" - PUT should update the blog with correct data", async () => {

        const updateData = {
            "name": "Bloggggg 1",
            "description": "blog about nothing and less",
            "websiteUrl": "http://www.test-123.com"
        }
        // send valid data

        await request(app).put(routerName + testBlog1.id)
            .auth("admin", "qwerty")
            .send(updateData)
            .expect(204);

        const res = await request(app).get(routerName + testBlog1.id).expect(200); // received get request and write it to variable res

        expect(res.body).toEqual(testBlog1 = {
            ...testBlog1,
            ...updateData
        })
        // check that the data on the server has not been updated
    })


    // GET requests

    it(" - GET request without ID should return array with length equal 2", async () => {
        const result = await request(app).get(routerName)
        const startBlogsArrayLength = result.body.length

        const res = await request(app).get(routerName).expect(200);

        expect(res.body.length).toBe(startBlogsArrayLength) // check array length
    })

    it(" - GET with invalid ID should return 404", async () => {

        await request(app).get(routerName + "-100").expect(404);

    })

    it(" - GET with valid ID should return 200 and object", async () => {

        await request(app).get(routerName + testBlog1.id).expect(200, testBlog1);

    })

    it(" - GET request with address /id/posts should return view model with 1 item", async () => {


        const res = await request(app).get(routerName + "/" + testBlog1.id + "/posts").expect(200);

        expect(res.body.items.length).toBe(1) // check array length
    })


    // DELETE request

    it(" - delete with invalid ID should return 404", async () => {

        await request(app)
            .delete(routerName + "-101")
            .auth("admin", "qwerty")
            .expect(404);

    })

    it(" - delete with invalid authorization should return 401", async () => {

        await request(app)
            .delete(routerName + testBlog1.id)
            .auth("odmin", "qwerty")
            .expect(401);

    })

    it(" - delete with valid ID should return 204 and array with length equal 0", async () => {

        await request(app)
            .delete(routerName + testBlog1.id)
            .auth("admin", "qwerty")
            .expect(204);
        const res = await request(app).get(routerName).expect(200);

        expect(res.body.items.length).toBe(0);

    })


})
