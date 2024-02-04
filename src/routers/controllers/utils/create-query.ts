import {QueryUsersRequestType, SearchUsersRepositoryType, SortUsersRepositoryType} from "../../../types/users/input";

export const createQuery = (query: QueryUsersRequestType) => {

	const sortData: SortUsersRepositoryType = {
		sortBy: query.sortBy || "createdAt",
		sortDirection: query.sortDirection || "desc",
		pageNumber: query.pageNumber || 1,
		pageSize: query.pageSize || 10
	};

	const searchData: SearchUsersRepositoryType = {
		searchLoginTerm: query.searchLoginTerm || null,
		searchEmailTerm: query.searchEmailTerm || null
	};

	return {sortData, searchData};
};

// searchNameTerm: req.query.searchNameTerm || null
