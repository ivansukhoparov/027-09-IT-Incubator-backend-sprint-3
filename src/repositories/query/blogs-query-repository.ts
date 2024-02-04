import {BlogOutputType, BlogType} from "../../types/blogs/output";
import {SearchBlogRepositoryType, SortBlogRepositoryType,} from "../../types/blogs/input";
import {ObjectId, WithId} from "mongodb";
import {blogMapper} from "../../types/blogs/mapper";
import {blogCollection} from "../../db/mongo/mongo-collections";
import {ViewModelType} from "../../types/view-model";
import {BlogModel} from "../../db/mongoose/models";
import {injectable} from "inversify";
import {QuerySearchType, QuerySortType} from "../../types/common";
import {SORT} from "../../utils/comon";

@injectable()
export class BlogsQueryRepository {

	async getAllBlogs(sortData: QuerySortType, searchData: QuerySearchType): Promise<ViewModelType<BlogOutputType>> {
		let searchKey = {};

		// check if have searchNameTerm create search key
		if (searchData.searchNameTerm) searchKey = {name: {$regex: searchData.searchNameTerm, $options: "i"}};

		// calculate limits for DB request
		const documentsTotalCount = await blogCollection.countDocuments(searchKey); // Receive total count of blogs
		const pageCount = Math.ceil(documentsTotalCount / +sortData.pageSize); // Calculate total pages count according to page size
		const skippedDocuments = (+sortData.pageNumber - 1) * +sortData.pageSize; // Calculate count of skipped docs before requested page

		// Get documents from DB
		const blogs: WithId<BlogType>[] = await BlogModel.find(searchKey)
			.sort(sortData.sortBy+" "+SORT[sortData.sortDirection])
			.skip(+skippedDocuments)
			.limit(+sortData.pageSize)
			.lean();

		return {
			pagesCount: pageCount,
			page: +sortData.pageNumber,
			pageSize: +sortData.pageSize,
			totalCount: documentsTotalCount,
			items: blogs.map(blogMapper)
		};
	}

	async getBlogById(id: string): Promise<BlogOutputType | null> {
		try {
			const blog: WithId<BlogType> | null = await BlogModel.findOne({_id: new ObjectId(id)});
			if (!blog) {
				return null;
			}
			return blogMapper(blog);
		} catch (err) {
			return null;
		}
	}
}


// === OLD VERSION OF REPOSITORIES USES NATIVE MONGO DRIVER ===
//
// export class BlogsQueryRepositoryMongoNative {
//
//     static async getAllBlogs(sortData: SortBlogRepositoryType, searchData: SearchBlogRepositoryType): Promise<ViewModelType<BlogOutputType>> {
//         let searchKey = {};
//     //    let sortKey = {};
//     //    let sortDirection: number;
//
//         // check if have searchNameTerm create search key
//         if (searchData.searchNameTerm) searchKey = {name: {$regex: searchData.searchNameTerm, $options: "i"}};
//
//         // calculate limits for DB request
//         const documentsTotalCount = await blogCollection.countDocuments(searchKey); // Receive total count of blogs
//         const pageCount = Math.ceil(documentsTotalCount / +sortData.pageSize); // Calculate total pages count according to page size
//         const skippedDocuments = (+sortData.pageNumber - 1) * +sortData.pageSize; // Calculate count of skipped docs before requested page
//
//         // check if sortDirection is "desc" assign sortDirection value -1, else assign 1
//     //    if (sortData.sortDirection === "desc") sortDirection = -1;
//     //    else sortDirection = 1;
//
//         // check if have fields exists assign the same one else assign "createdAt" value
//     /*   if (sortData.sortBy === "description") sortKey = {description: sortDirection};
//         else if (sortData.sortBy === "websiteUrl") sortKey = {websiteUrl: sortDirection};
//         else if (sortData.sortBy === "name") sortKey = {name: sortDirection};
//         else if (sortData.sortBy === "isMembership") sortKey = {isMembership: sortDirection};
//         else sortKey = {createdAt: sortDirection};
//     */
//
//         // Get documents from DB
//         const blogs: WithId<BlogType>[] = await blogCollection.find(searchKey)
//             .sort(sortData.sortBy,sortData.sortDirection)
//             .skip(+skippedDocuments)
//             .limit(+sortData.pageSize)
//             .toArray();
//
//         return {
//             pagesCount: pageCount,
//             page: +sortData.pageNumber,
//             pageSize: +sortData.pageSize,
//             totalCount: documentsTotalCount,
//             items: blogs.map(blogMapper)
//         }
//     }
//
//     static async getBlogById(id: string): Promise<BlogOutputType | null> {
//         try {
//             const blog: WithId<BlogType> | null = await blogCollection.findOne({_id: new ObjectId(id)});
//             if (!blog) {
//                 return null;
//             }
//             return blogMapper(blog)
//         } catch (err) {
//             return null;
//         }
//     }
//
//
// }

