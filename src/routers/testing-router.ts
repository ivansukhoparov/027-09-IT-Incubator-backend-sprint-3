import {Router, Request, Response} from "express";

import {blogCollection, dbBlogs, postCollection, usersCollection, videosCollection} from "../db/mongo/mongo-collections";

export const testingRouter = Router();

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
 	//await dbBlogs.dropDatabase();
	res.sendStatus(204);
});
