//import request from 'supertest';
import request = require("supertest");
import {app} from "../../src/app";


const testName = "/videos/";

describe(testName, ()=>{
    beforeAll(async ()=>{
        await request(app).delete("/testing/all-data");
    })

    it ("01 - should be return 200 and empty array", async ()=>{
       await request(app).get(testName).expect(200,[]);
    })

    // POST requests

    it("02 - POST does not create the video with incorrect data (no title, no author)", async ()=>{
        await request(app).post(testName).send({
            "title": "",
            "author": "",
        }).expect(400, {errorsMessages:[{message:"Invalid title", field:"title"}, {message:"Invalid author", field:"author"}]});

        await request(app).get(testName).expect(200,[]);
    })

    it("03 - POST does not create the video with incorrect data (title and author over length)", async ()=>{
        await request(app).post(testName).send({
            "title": "qwertyuiopasdfghjklzxcvbnasdfghqwedfgxcvewr",
            "author": "qwertyuiopasdfghjklzxcvbnasdfghqwedfgxcvewr",
        }).expect(400, {errorsMessages:[{message:"Invalid title", field:"title"}, {message:"Invalid author", field:"author"}]});

        await request(app).get(testName).expect(200,[]);
    })

    it("04 - POST does not create the video with incorrect data (title or author over length)", async ()=>{
        await request(app).post(testName).send({
            "title": "qwertyuiopasdfghjklzxcvbnasdfghqwedfgxcvewr",
            "author": "Ivan",
        }).expect(400, {errorsMessages:[{message:"Invalid title", field:"title"}]});

        await request(app).post(testName).send({
            "title": "New video",
            "author": "qwertyuiopasdfghjklzxcvbnasdfghqwedfgxcvewr",
        }).expect(400, {errorsMessages:[{message:"Invalid author", field:"author"}]});

        await request(app).get(testName).expect(200,[]);
    })

    let testVideo1:any;

    it("05 - POST should be create the video with correct data (only title and author)", async ()=>{
        const res = await request(app).post(testName).send({
            "title": "New Video 1",
            "author": "Ivan"
        }).expect(201);

        testVideo1= res.body;

        await request(app).get(testName+testVideo1.id).expect(testVideo1);
    })

    let testVideo2:any;

    it("06 - POST should be create the video with correct data (only title and author and invalid AvailableResolutions)", async ()=>{
        const res = await request(app).post(testName).send({
            "title": "New Video 2",
            "author": "Ivan",
            "availableResolutions":50
        }).expect(201);

        testVideo2= res.body;

        await request(app).get(testName+testVideo2.id).expect(testVideo2);

        expect(testVideo2.availableResolutions).toEqual([]);
    })

    let testVideo3:any;

    it("07 - POST should be create the video with correct data (only title and author and  AvailableResolutions)", async ()=>{
        const res = await request(app).post(testName).send({
            "title": "New Video 3",
            "author": "Ivan",
            "availableResolutions": ["P144", "P240"]
        }).expect(201);

        testVideo3= res.body;

        await request(app).get(testName+testVideo3.id).expect(testVideo3);

        expect(testVideo3.availableResolutions).toEqual(["P144", "P240"]);
    })

    // PUT requests

    it("08 - PUT does not update the video with incorrect data (no title)", async ()=>{

        // send invalid data

        await request(app).put(testName+testVideo1.id).send({
            "title": "",
            "author": "Ivan",
            "availableResolutions": [],
            "canBeDownloaded": false,
            "minAgeRestriction": null
        }).expect(400,{errorsMessages:[{
                message: "Invalid title",
                field: "title"
            }]});

        await request(app).get(testName+testVideo1.id).expect(testVideo1); // check that the data on the server has not been updated
    })

    it("09 - PUT does not update the video with incorrect data (title over length)", async ()=>{

        // send invalid data

        await request(app).put(testName+testVideo1.id).send({
            "title": "asdkjheejdhdkkjsdhsldjkfhsdkjfhlskdjhflkajdhflrkjfjinvlkjfvkfjvdfjnvlkjrnv",
            "author": "Ivan",
            "availableResolutions": [],
            "canBeDownloaded": false,
            "minAgeRestriction": null
        }).expect(400,{errorsMessages:[{
                message: "Invalid title",
                field: "title"
            }]});

        await request(app).get(testName+testVideo1.id).expect(testVideo1); // check that the data on the server has not been updated
    })

    it("10 - PUT does not update the video with incorrect data (no author)", async ()=>{

        // send invalid data

        await request(app).put(testName+testVideo1.id).send({
            "title": "New Video 1",
            "author": "",
            "availableResolutions": [],
            "canBeDownloaded": false,
            "minAgeRestriction": null
        }).expect(400,{errorsMessages:[{
                message: "Invalid author",
                field: "author"
            }]});

        await request(app).get(testName+testVideo1.id).expect(testVideo1); // check that the data on the server has not been updated
    })

    it("10-2 - PUT does not update the video with incorrect data (over length author)", async ()=>{

        // send invalid data

        await request(app).put(testName+testVideo1.id).send({
            "title": "New Video 1",
            "author": "aasdkjhfkjhvkjhvrkjhvskjdhfksjdhgfksjhgfkjsdbvksjhvfrkjdhvfkrjhvdkfvb",
            "availableResolutions": [],
            "canBeDownloaded": false,
            "minAgeRestriction": null
        }).expect(400,{errorsMessages:[{
                message: "Invalid author",
                field: "author"
            }]});

        await request(app).get(testName+testVideo1.id).expect(testVideo1); // check that the data on the server has not been updated
    })

    it("11 - PUT does not update the video with incorrect data (invalid availableResolutions)", async ()=>{

        // send invalid data

        await request(app).put(testName+testVideo1.id).send({
            "title": "New Video 1",
            "author": "Ivan",
            "availableResolutions": "no available resolutions",
            "canBeDownloaded": false,
            "minAgeRestriction": null
        }).expect(400, {errorsMessages:[{
                message: "Invalid availableResolutions",
                field: "availableResolutions"
            }]});

        await request(app).get(testName+testVideo1.id).expect(testVideo1); // check that the data on the server has not been updated
    })

    it("12 - PUT does not update the video with incorrect data (invalid canBeDownloaded)", async ()=>{

        // send invalid data

        await request(app).put(testName+testVideo1.id).send({
            "title": "New Video 1",
            "author": "Ivan",
            "availableResolutions": [],
            "canBeDownloaded": 'no',
            "minAgeRestriction": null
        }).expect(400, {errorsMessages:[{
                message: "Invalid canBeDownloaded",
                field: "canBeDownloaded"
            }]});

        await request(app).get(testName+testVideo1.id).expect(testVideo1); // check that the data on the server has not been updated
    })

    it("13 - PUT does not update the video with incorrect data (invalid minAgeRestriction less then 1)", async ()=>{

        // send invalid data

        await request(app).put(testName+testVideo1.id).send({
            "title": "New Video 1",
            "author": "Ivan",
            "availableResolutions": [],
            "canBeDownloaded": false,
            "minAgeRestriction": 0
        }).expect(400, {errorsMessages:[{
                message: "Invalid minAgeRestriction",
                field: "minAgeRestriction"
            }]});

        await request(app).get(testName+testVideo1.id).expect(testVideo1); // check that the data on the server has not been updated
    })

    it("14 - PUT does not update the video with incorrect data (invalid minAgeRestriction grater then 18)", async ()=>{

        // send invalid data

        await request(app).put(testName+testVideo1.id).send({
            "title": "New Video 1",
            "author": "Ivan",
            "availableResolutions": [],
            "canBeDownloaded": false,
            "minAgeRestriction": 50
        }).expect(400, {errorsMessages:[{
                message: "Invalid minAgeRestriction",
                field: "minAgeRestriction"
            }]});

        await request(app).get(testName+testVideo1.id).expect(testVideo1); // check that the data on the server has not been updated
    })

    it("15 - PUT does not update the video with incorrect data (invalid minAgeRestriction not number)", async ()=>{

        // send invalid data

        await request(app).put(testName+testVideo1.id).send({
            "title": "New Video 1",
            "author": "Ivan",
            "availableResolutions": [],
            "canBeDownloaded": false,
            "minAgeRestriction": 'blahblah'
        }).expect(400, {errorsMessages:[{
                message: "Invalid minAgeRestriction",
                field: "minAgeRestriction"
            }]});

        await request(app).get(testName+testVideo1.id).expect(testVideo1); // check that the data on the server has not been updated
    })

    it("16 - PUT should update the video with correct data", async ()=>{

        // send valid data

        await request(app).put(testName+testVideo1.id).send({
            "title": "Updated video",
            "author": "Glasha",
            "availableResolutions": ["P720", "P1080", "P1440", "P2160"],
            "canBeDownloaded": true,
            "minAgeRestriction": 18,
            "publicationDate": "2023-11-07T22:36:07.308Z"
        }).expect(204);

        const res =  await request(app).get(testName+testVideo1.id).expect(200); // received get request and write it to variable res

        expect(testVideo1={
            ...testVideo1,
            "title": "Updated video",
            "author": "Glasha",
            "availableResolutions": ["P720", "P1080", "P1440", "P2160"],
            "canBeDownloaded": true,
            "minAgeRestriction": 18,
            "publicationDate": "2023-11-07T22:36:07.308Z" // change it to the date received with get request
        })
        // check that the data on the server has not been updated
    })


    // GET requests
    it("18 - GET request without ID should return array with length equal 3", async ()=>{

       const res = await request(app).get(testName).expect(200);

       expect(res.body.length).toBe(3) // check array length
    })

    it("19 - GET with invalid ID should return 404", async ()=>{

       await request(app).get(testName+"-100").expect(404);

    })

    it("20 - GET with valid ID should return 200 and object", async ()=>{

        await request(app).get(testName+testVideo2.id).expect(200,testVideo2 );

    })

    // DELETE request
    it("21 - delete with invalid ID should return 404", async ()=>{

        await request(app).delete(testName+"-100").expect(404 );

    })

    it("22 - delete with valid ID should return 204 and array with length equal 2", async ()=>{

        await request(app).delete(testName+testVideo2.id).expect(204);
        const res = await request(app).get(testName).expect(200 );
        expect(res.body.length).toBe(2);

    })

    it("23 - delete with valid ID to all pasts should return 204 and empty array", async ()=>{

        await request(app).delete(testName+testVideo3.id).expect(204);
        await request(app).delete(testName+testVideo1.id).expect(204);
        await request(app).get(testName).expect(200,[]);


    })

})
