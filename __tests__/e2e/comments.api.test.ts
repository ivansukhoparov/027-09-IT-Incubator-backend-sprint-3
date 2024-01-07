import request = require("supertest");
import {app} from "../../src/app";
import {CreateUserType} from "../../src/types/users/input";
import {CreatePostDto} from "../../src/types/posts/input";
import {UserOutputType} from "../../src/types/users/output";
import {PostOutputType} from "../../src/types/posts/output";
import {HTTP_STATUSES} from "../../src/utils/comon";
import {CreateBlogDto} from "../../src/types/blogs/input";
import {BlogOutputType} from "../../src/types/blogs/output";
import {OutputCommentType} from "../../src/types/comments/output";

interface ITestUserType extends UserOutputType {
    accessToken?: string
}



const createTestUsers: Array<CreateUserType> = [
    {
        login: "user1",
        email: "qwe123@gmail.com",
        password: "qwerty"
    },
    {
        login: "user2",
        email: "qwe123@gmail.com",
        password: "qwerty1"
    }
];
const createTestBlogs: Array<CreateBlogDto> = [
    {
        "name": "Blog 1",
        "description": "blog about nothing",
        "websiteUrl": "http://www.test.com"
    }
];
const createTestPosts: Array<CreatePostDto> = [
    {
        title: "Post 1",
        shortDescription: "a very short description",
        content: "some content",
        blogId: "testBlogID"
    },
    {
        title: "Post 2",
        shortDescription: "a very short description",
        content: "some content",
        blogId: "testBlogID"
    }
];

const testUsers: Array<ITestUserType> = [];
const testPosts: Array<PostOutputType> = [];
const testBlogs: Array<BlogOutputType> = [];
const testComments: Array<OutputCommentType> = [];

const testCommentsData = {
    validComment: {
        request: {
            content: "this string is grater then twenty and less then three hundreds letters"
        },
        response: {
            id: expect.any(String),
            content: 'this string is grater then twenty and less then three hundreds letters',
            commentatorInfo: {
                userId: 'userId',
                userLogin: 'user1'
            },
            createdAt: expect.any(String)
        }
    },
    shortComment: {content: "length_19-weqweqweq"},
    longComment: {
        content: `length_301-weqweqweq_123456789_123456789_123456789_123456789_123456789_123456789_123456789
    _123456789_123456789_123456789_123456789_123456789_123456789_123456789_123456789_123456789_123456789_123456789
    _123456789_123456789_123456789_123456789_123456789_123456789_123456789_123456789_123456789_`
    },
    updateComment: {content: "length_22-weqweqweqqwe"}

}

const routerName = "/comments/"
const errorMessage = (field?: string) => {
    return {
        errorsMessages: [
            {
                message: expect.any(String),
                field: "content" || field
            }
        ]
    }
}
describe(routerName, () => {
    beforeAll(async () => {
        // Delete add data before tests
        await request(app).delete("/testing/all-data");
        // create users for tests
        for (let i = 0; i < createTestUsers.length; i++) {
            // Create user
            const createdUser = await request(app).post("/users/")
                .auth("admin", "qwerty")
                .send(createTestUsers[i])

            // Authenticate user
            const userToken = await request(app).post("/auth/login")
                .send({
                    loginOrEmail: createTestUsers[i].login,
                    password: createTestUsers[i].password
                })
            testUsers[i] = {...createdUser.body, ...userToken.body};
        }
        // Create new blog for tests
        for (let i = 0; i < createTestBlogs.length; i++) {
            const res = await request(app).post("/blogs/")
                .auth("admin", "qwerty")
                .send(createTestBlogs[i])
                .expect(HTTP_STATUSES.CREATED_201); // Check blog is created
            testBlogs[i] = res.body;
        }
        // Create new post for tests
        for (let i = 0; i < createTestPosts.length; i++) {
            const res = await request(app).post(`/posts/`)
                .auth("admin", "qwerty")
                .send({...createTestPosts[i], blogId: testBlogs[0].id})
                .expect(HTTP_STATUSES.CREATED_201); // Check post is created
            testPosts[i] = res.body;
        }
        // Create comments for post1 by user1 (30 items)
        for (let i = 0; i < 30; i++) {
            const res = await request(app).post(`/posts/${testPosts[0].id}/comments`)
                .set("Authorization", `Bearer ${testUsers[0].accessToken}`)
                .send(testCommentsData.validComment.request)
                .expect(HTTP_STATUSES.CREATED_201);
            testComments[i] = res.body;
        }

    });

    it("created arrays with test data should be contains data", () => {
        expect(testUsers[0].login).toBe(createTestUsers[0].login);
        expect(testUsers[1].login).toBe(createTestUsers[1].login);
        expect(testBlogs[0].name).toBe(createTestBlogs[0].name);
        expect(testPosts[0].title).toBe(createTestPosts[0].title);
    });

    // POST requests

    it(" - POST create comment without authorization should return 401", async () => {
        await request(app).post(`/posts/${testPosts[0].id}/comments`).send(testCommentsData.validComment).expect(HTTP_STATUSES.UNAUTHORIZED_401);
    })

    it("- POST comment with invalid token should return 401", async () => {
        const result = await request(app).post(`/posts/${testPosts[0].id}/comments`)
            .set("Authorization", `Bearer This_is_not_a_token`)
            .send(testCommentsData.shortComment)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401);
    })

    it(" - POST create comment to post with invalid Id should return 404", async () => {
        await request(app).post(`/posts/123456789/comments`)
            .set("Authorization", `Bearer ${testUsers[0].accessToken}`)
            .send(testCommentsData.validComment.request)
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    })

    it("- POST comment with invalid data (too short) should return 400", async () => {
        const result = await request(app).post(`/posts/${testPosts[0].id}/comments`)
            .set("Authorization", `Bearer ${testUsers[0].accessToken}`)
            .send(testCommentsData.shortComment)
            .expect(HTTP_STATUSES.BAD_REQUEST_400);
        expect(result.body).toEqual(errorMessage());
    })

    it("- POST comment with invalid data (too long) should return 400", async () => {
        const result = await request(app).post(`/posts/${testPosts[0].id}/comments`)
            .set("Authorization", `Bearer ${testUsers[0].accessToken}`)
            .send(testCommentsData.longComment)
            .expect(HTTP_STATUSES.BAD_REQUEST_400);
        expect(result.body).toEqual(errorMessage());
    })

    it("+ POST comment with valid data and post id should be created", async () => {
        const result = await request(app).post(`/posts/${testPosts[0].id}/comments`)
            .set("Authorization", `Bearer ${testUsers[0].accessToken}`)
            .send(testCommentsData.validComment.request)
            .expect(HTTP_STATUSES.CREATED_201);
        expect(result.body).toEqual({
            ...testCommentsData.validComment.response,
            commentatorInfo: {
                ...testCommentsData.validComment.response.commentatorInfo,
                userId: testUsers[0].id
            }
        })
    })

    // PUT requests

    it(" - PUT update comment without authorization should return 401", async () => {
        await request(app).put(`/comments/${testComments[0].id}`).send(testCommentsData.updateComment).expect(HTTP_STATUSES.UNAUTHORIZED_401);
    })

    it("- PUT update comment with invalid token should return 401", async () => {
        const result = await request(app).put(`/comments/${testComments[0].id}`)
            .set("Authorization", `Bearer This_is_not_a_token`)
            .send(testCommentsData.shortComment)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401);
    })

    it(" - PUT update comment to post with invalid Id should return 404", async () => {
        await request(app).put(`/comments/1234567890`)
            .set("Authorization", `Bearer ${testUsers[0].accessToken}`)
            .send(testCommentsData.validComment.request)
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    })

    it("- PUT update with invalid data (too short) should return 400", async () => {
        const result = await request(app).put(`/comments/${testComments[0].id}`)
            .set("Authorization", `Bearer ${testUsers[0].accessToken}`)
            .send(testCommentsData.shortComment)
            .expect(HTTP_STATUSES.BAD_REQUEST_400);
        expect(result.body).toEqual(errorMessage());
    })

    it("- PUT update with invalid data (too long) should return 400", async () => {
        const result = await request(app).put(`/comments/${testComments[0].id}`)
            .set("Authorization", `Bearer ${testUsers[0].accessToken}`)
            .send(testCommentsData.longComment)
            .expect(HTTP_STATUSES.BAD_REQUEST_400);
        expect(result.body).toEqual(errorMessage());
    })

    it("+ PUT update with valid data and post id should be updated", async () => {
        await request(app).put(`/comments/${testComments[0].id}`)
            .set("Authorization", `Bearer ${testUsers[0].accessToken}`)
            .send(testCommentsData.updateComment)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        // check is updated
        const result = await request(app).get(`/comments/${testComments[0].id}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(result.body).toEqual({
            ...testCommentsData.validComment.response,
            content: testCommentsData.updateComment.content,
            commentatorInfo: {
                ...testCommentsData.validComment.response.commentatorInfo,
                userId: testUsers[0].id
            }
        })
    })

    // GET requests

    // GET requests for single comment
    it(" - GET request with invalid id should return 404", async () => {
        const result = await request(app).get(`/comments/1234567890`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(" + GET request by post id should return 200 and comment", async () => {
        const result = await request(app).get(`/comments/${testComments[0].id}`)
            .expect(HTTP_STATUSES.OK_200)

        expect(result.body).toEqual({
            ...testCommentsData.validComment.response,
            content: testCommentsData.updateComment.content,
            commentatorInfo: {
                ...testCommentsData.validComment.response.commentatorInfo,
                userId: testUsers[0].id
            }
        })
    })

    // GET requests by post id
    it(" - GET request with invalid post id should return 404", async () => {
        const result = await request(app).get(`/posts/1234567890/comments`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(" + GET request by post id should return 200 and view model with 31 items", async () => {
        const result = await request(app).get(`/posts/${testPosts[0].id}/comments`)
            .expect(HTTP_STATUSES.OK_200)

        expect(result.body).toEqual({
            pagesCount: 4,
            page: 1,
            pageSize: 10,
            totalCount: 31,
            items: expect.any(Array)
        })
        expect(result.body.items.length).toBe(10)
    })

    it(" + GET request by post id should return 200 and view model with 0 items", async () => {
        const result = await request(app).get(`/posts/${testPosts[1].id}/comments`)
            .expect(HTTP_STATUSES.OK_200)

        expect(result.body).toEqual({
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: []
        })
        expect(result.body.items.length).toBe(0)
    })

// DELETE requests

    it(" - doesn't delete without authorization, return 401", async ()=>{
        await request(app).delete(`/comments/${testComments[0]}`).expect(HTTP_STATUSES.UNAUTHORIZED_401);
        })

    it(" - doesn't delete if user not owner, return 403", async ()=>{
        await request(app).delete(`/comments/${testComments[0].id}`)
            .set("Authorization", `Bearer ${testUsers[1].accessToken}`)
            .expect(HTTP_STATUSES.FORBIDDEN_403);
    })
    it(" - should return 404 if id incorrect", async ()=>{
        await request(app).delete(`/comments/123457789456`)
            .set("Authorization", `Bearer ${testUsers[0].accessToken}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    })

    it(" - should delete if all correct", async ()=>{
        await request(app).delete(`/comments/${testComments[0].id}`)
            .set("Authorization", `Bearer ${testUsers[0].accessToken}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        const result = await request(app).get(`/posts/${testPosts[0].id}/comments`)
            .expect(HTTP_STATUSES.OK_200)

        expect(result.body).toEqual({
            pagesCount: 3,
            page: 1,
            pageSize: 10,
            totalCount: 30,
            items: expect.any(Array)
        })
        expect(result.body.items.length).toBe(10)
    })


})





