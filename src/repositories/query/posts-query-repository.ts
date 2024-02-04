import {PostDtoType, PostOutputType} from "../../types/posts/output";
import {PostSortType, SortPostRepositoryType} from "../../types/posts/input";
import {postCollection} from "../../db/mongo/mongo-collections";
import {postMapper} from "../../types/posts/mapper";
import {ObjectId, WithId} from "mongodb";
import {ViewModelType} from "../../types/view-model";
import {PostModel} from "../../db/mongoose/models";
import {injectable} from "inversify";

@injectable()
export class PostsQueryRepository {

	// return all posts from database
	async getAllPosts(sortData: SortPostRepositoryType, blogId?: string): Promise<ViewModelType<PostOutputType>> {

		let searchKey = {};
		const sortDirection = {
			desc: -1,
			asc: 1
		};

		if (blogId) searchKey = {blogId: blogId};

		// calculate limits for DB request
		const documentsTotalCount = await postCollection.countDocuments(searchKey); // Receive total count of blogs
		const pageCount = Math.ceil(documentsTotalCount / +sortData.pageSize); // Calculate total pages count according to page size
		const skippedDocuments = (+sortData.pageNumber - 1) * +sortData.pageSize;

		const sortBy: PostSortType = sortData.sortBy ? sortData.sortBy : "createdAt";

		// Get documents from DB
		const posts: WithId<PostDtoType>[] = await PostModel.find(searchKey)
			.sort(sortBy + " " + sortDirection[sortData.sortDirection])
			.skip(+skippedDocuments)
			.limit(+sortData.pageSize)
			.lean();

		return {
			pagesCount: pageCount,
			page: +sortData.pageNumber,
			pageSize: +sortData.pageSize,
			totalCount: documentsTotalCount,
			items: posts.map(postMapper)
		};
	}


	// return one post by id
	async getPostById(id: string): Promise<PostOutputType> {

		const post: WithId<PostDtoType> | null = await PostModel.findOne({_id: new ObjectId(id)});
		if (!post) throw new Error("not_found");

		return postMapper(post);

	}
}

