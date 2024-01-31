import {PostOutputType, PostDtoType} from "../types/posts/output";
import {SortPostRepositoryType} from "../types/posts/input";
import {postCollection} from "../db/mongo/mongo-collections";
import {postMapper} from "../types/posts/mapper";
import {ObjectId, WithId} from "mongodb";
import {ViewModelType} from "../types/view-model";


export class PostsQueryRepository {

    // return all posts from database
    static async getAllPosts(sortData: SortPostRepositoryType, blogId?: string): Promise<ViewModelType<PostOutputType>> {
        let searchKey = {}
        let sortKey = {};
        let sortDirection: number;

        if (blogId) searchKey = {blogId: blogId};

        // calculate limits for DB request
        const documentsTotalCount = await postCollection.countDocuments(searchKey); // Receive total count of blogs
        const pageCount = Math.ceil(documentsTotalCount / +sortData.pageSize); // Calculate total pages count according to page size
        const skippedDocuments = (+sortData.pageNumber - 1) * +sortData.pageSize;

        // check if sortDirection is "desc" assign sortDirection value -1, else assign 1
        if (sortData.sortDirection === "desc") sortDirection = -1;
        else sortDirection = 1;

        // check if have fields exists assign the same one else assign "createdAt" value
        if (sortData.sortBy === "title") sortKey = {title: sortDirection};
        else if (sortData.sortBy === "shortDescription") sortKey = {shortDescription: sortDirection};
        else if (sortData.sortBy === "content") sortKey = {content: sortDirection};
        else if (sortData.sortBy === "blogId") sortKey = {blogId: sortDirection};
        else if (sortData.sortBy === "blogName") sortKey = {blogName: sortDirection};
        else sortKey = {createdAt: sortDirection};

        // Get documents from DB
        const posts: WithId<PostDtoType>[] = await postCollection.find(searchKey).sort(sortKey).skip(+skippedDocuments).limit(+sortData.pageSize).toArray();

        return {
            pagesCount: pageCount,
            page: +sortData.pageNumber,
            pageSize: +sortData.pageSize,
            totalCount: documentsTotalCount,
            items: posts.map(postMapper)
        };

    };


    // return one post by id
    static async getPostById(id: string): Promise<PostOutputType | null> {
        try {
            const post: WithId<PostDtoType> | null = await postCollection.findOne({_id: new ObjectId(id)});
            if (!post) {
                return null;
            }
            return postMapper(post);
        } catch (err) {
            return null;
        }


    }


}

