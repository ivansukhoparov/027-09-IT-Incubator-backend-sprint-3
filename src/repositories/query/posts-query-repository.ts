import {PostDtoType, PostLikeDto, PostOutputType, PostsLikesInfoType} from "../../types/posts/output";
import {postCollection} from "../../db/mongo/mongo-collections";
import {postLikesMapper, postMapper} from "../../types/posts/mapper";
import {ObjectId, WithId} from "mongodb";
import {ViewModelType} from "../../types/view-model";
import {PostLikeModel, PostModel} from "../../db/mongoose/models";
import {injectable} from "inversify";
import {QuerySortType} from "../../types/common";
import {LikeStatusType} from "../../types/comments/input";

@injectable()
export class PostsQueryRepository {

	// return all posts from database
	async getAllPosts(sortData: QuerySortType, blogId: string | null = null, userId: string|null = null): Promise<ViewModelType<PostOutputType>> {

		let searchKey = {};

		if (blogId) searchKey = {blogId: blogId};

		// calculate limits for DB request
		const documentsTotalCount = await postCollection.countDocuments(searchKey); // Receive total count of blogs
		const pageCount = Math.ceil(documentsTotalCount / +sortData.pageSize); // Calculate total pages count according to page size
		const skippedDocuments = (+sortData.pageNumber - 1) * +sortData.pageSize;

		const sortBy = sortData.sortBy;

		// Get documents from DB
		const posts: WithId<PostDtoType>[] = await PostModel.find(searchKey)
			.sort({[sortBy]: sortData.sortDirection})
			.skip(+skippedDocuments)
			.limit(+sortData.pageSize)
			.lean();

		const mappedPosts: PostOutputType[] = [];

		for (let i = 0; i < posts.length; i++) {
			console.log(posts[i]._id.toString()+ "  " + userId);
			const likes = await this.getLikes(posts[i]._id.toString(), userId);
			mappedPosts.push(postMapper(posts[i], likes));
		}

		return {
			pagesCount: pageCount,
			page: +sortData.pageNumber,
			pageSize: +sortData.pageSize,
			totalCount: documentsTotalCount,
			items: mappedPosts
		};
	}


	// return one post by id
	async getPostById(id: string, userId: string|null = null): Promise<PostOutputType> {

		const post: WithId<PostDtoType> | null = await PostModel.findOne({_id: new ObjectId(id)});
		if (!post) throw new Error("not_found");
		const likes = await this.getLikes(id, userId);
		return postMapper(post, likes);
	}

	async getLikes(postId: string, userId: string|null = null): Promise<PostsLikesInfoType> {
		let likeStatus: LikeStatusType = "None";
		console.log(userId);
		if (userId) {
			const userLike = await PostLikeModel.findOne({$and: [{postId: postId}, {likedUserId: userId}]}).lean();
			if (userLike) {
				likeStatus = userLike.status;
			}
		}

		const likesCount = await PostLikeModel.countDocuments({$and: [{postId: postId}, {status: "Like"}]});
		const dislikesCount = await PostLikeModel.countDocuments({$and: [{postId: postId}, {status: "Dislike"}]});
		const newestLikes: Array<WithId<PostLikeDto>> = await PostLikeModel.find({$and: [{postId: postId}, {status: "Like"}]}).sort({"addedAt": "desc"}).limit(3).lean();

		return {
			likesCount: likesCount,
			dislikesCount: dislikesCount,
			myStatus: likeStatus,
			newestLikes: newestLikes.map(postLikesMapper)
		};
	}
}

