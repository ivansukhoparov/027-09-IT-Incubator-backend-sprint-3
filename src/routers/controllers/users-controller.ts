import {UserService} from "../../domains/user-service";
import {UsersQueryRepository} from "../../repositories/query/users-query-repository";
import {UsersRepository} from "../../repositories/users-repository";
import {
	Params,
	QuerySearchType,
	QuerySortType,
	RequestWithBody,
	RequestWithParams,
	RequestWithSearchTerms
} from "../../types/common";
import {CreateUserType, QueryUsersRequestType} from "../../types/users/input";
import {Response} from "express";
import {UserOutputType} from "../../types/users/output";
import {HTTP_STATUSES} from "../../utils/comon";
import {inject, injectable} from "inversify";
import {errorsHandler} from "../../utils/errors-handler";
import {createQuery} from "./utils/create-query";
import {ViewModelType} from "../../types/view-model";

@injectable()
export class UsersController {

	constructor(@inject(UserService) protected userService: UserService,
                @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository) {
	}

	async getUsers(req: RequestWithSearchTerms<QueryUsersRequestType>, res: Response) {
		try {
			const {sortData, searchData} = createQuery(req.query);
			const users:ViewModelType<UserOutputType> = await this.usersQueryRepository.getAllUsers(sortData, searchData);
			res.status(HTTP_STATUSES.OK_200).json(users);
		}catch (err) {
			errorsHandler(res, err);
		}
	}

	async createUser(req: RequestWithBody<CreateUserType>, res: Response) {
		try {
			const {login, email, password} = req.body;
			const createdUserId: string = await this.userService.create(login, email, password, true);
			const createdUser: UserOutputType = await this.usersQueryRepository.getUserById(createdUserId);
			res.status(HTTP_STATUSES.CREATED_201).json(createdUser);
		} catch (err) {
			errorsHandler(res, err);
		}
	}

	async deleteUser(req: RequestWithParams<Params>, res: Response) {
		try{
			await this.userService.delete(req.params.id);
			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
		}catch (err){
			res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
		}
	}
}




