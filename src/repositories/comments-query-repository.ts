import {commentsCollection} from "../db/mongo/mongo-collections";
import {ObjectId} from "mongodb";
import {commentMapper} from "../types/comments/mapper";
import {SortCommentsType} from "../types/comments/input";
import {OutputCommentType} from "../types/comments/output";
import {ViewModelType} from "../types/view-model";

export class CommentsQueryRepository {
    static async getAllCommentsByPostId(sortData: SortCommentsType, postId: string,): Promise<ViewModelType<OutputCommentType> | null> {
        try {
            const commentsCount = await commentsCollection.countDocuments({postId: postId});
            const pagesCount = Math.ceil(commentsCount / sortData.pageSize);
            const skipComments = (sortData.pageNumber - 1) * sortData.pageSize;

            const comments = await commentsCollection.find({postId: postId})
                .sort(sortData.sortBy, sortData.sortDirection)
                .skip(skipComments)
                .limit(sortData.pageSize)
                .toArray();

            return {
                pagesCount: pagesCount,
                page: sortData.pageNumber,
                pageSize: sortData.pageSize,
                totalCount: commentsCount,
                items: comments.map(commentMapper)
            }
        } catch (err) {
            return null
        }
    }

    static async getCommentById(commentId: string) {
        try {
            const comment = await commentsCollection.findOne({_id: new ObjectId(commentId)});
            if (comment) return commentMapper(comment);
            else return null;
        }catch (err){
            return null;
        }
    }
}

