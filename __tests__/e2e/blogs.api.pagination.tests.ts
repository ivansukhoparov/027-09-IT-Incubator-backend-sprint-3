import request = require("supertest");
import {app} from "../../src/app";

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
const blogs = [
    {
        "name": "Ann",
        "description": "Ann's blog about nothing",
        "websiteUrl": "http://www.Ann.com"
    },
    {
        "name": "Bob",
        "description": "Bob's blog about nothing",
        "websiteUrl": "http://www.zzz.com"
    },
    {
        "name": "Zuza",
        "description": "Zuza's blog about nothing",
        "websiteUrl": "http://www.zuza.com"
    },
    {
        "name": "Donja",
        "description": "Donja's  blog about nothing",
        "websiteUrl": "http://www.don.com"
    },
    {
        "name": "Ivan",
        "description": "Ivan's blog about nothing",
        "websiteUrl": "http://www.iviv.com"
    },
    {
        "name": "David",
        "description": "yarkiu blog about nothing",
        "websiteUrl": "http://www.dav.com"
    }
]

let createdBlogs;
describe(routerName, () => {
    // clear DB before testing
    beforeAll(async () => {
        await request(app).delete("/testing/all-data");
    })

    it(" - should be return 200 and empty items array", async () => {
        await request(app).get(routerName).expect(200, Results.emptyBlogs);
    })

    it(" - create 6 blogs", async ()=>{

        for (let i=0;i<6;i++){
            await request(app).post(routerName).auth("admin", "qwerty").send(blogs[i]).expect(201);
        }

        createdBlogs =  await request(app).get(routerName).expect(200);
        expect(createdBlogs.body.items.length).toBe(6);
    })



})
