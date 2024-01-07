import {CommentType} from "../types/comments/output";
import {commentsCollection} from "../db/db-collections";
import {ObjectId} from "mongodb";
import {UpdateCommentDto} from "../types/comments/input";

export class CommentsRepository{
    static async addNewComment(newComment:CommentType):Promise<string|null>{
        try{
            const result = await commentsCollection.insertOne(newComment);
            return result.insertedId.toString();
        }catch (err){
            return null;
        }
    }

    static async deleteCommentById(commentId:string){
        try {
            const result = await commentsCollection.deleteOne({_id:new ObjectId(commentId)});
            return result.deletedCount === 1;
        }catch (err){
            return null
        }
    }

    static async updateCommentById(updateData:UpdateCommentDto, id:string){
        try {

            const result = await commentsCollection.updateOne(
                {_id:new ObjectId(id)},
                { $set: updateData}
            )
            return result.matchedCount === 1;
        }catch(err){
            return false;
        }
    }
}

