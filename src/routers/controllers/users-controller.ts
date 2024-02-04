import {container} from "../../composition-root";
import {UserService} from "../../domains/user-service";
import {UsersQueryRepository} from "../../repositories/query/users-query-repository";
import {UsersRepository} from "../../repositories/users-repository";
import {Params, RequestWithBody, RequestWithParams, RequestWithSearchTerms} from "../../types/common";
import {
    CreateUserType,
    QueryUsersRequestType,
    SearchUsersRepositoryType,
    SortUsersRepositoryType
} from "../../types/users/input";
import {Response} from "express";
import {UserOutputType} from "../../types/users/output";
import {HTTP_STATUSES} from "../../utils/comon";
import {inject, injectable} from "inversify";

const userService = container.resolve<UserService>(UserService);
const usersQueryRepository = container.resolve<UsersQueryRepository>(UsersQueryRepository);
const usersRepository = container.resolve<UsersRepository>(UsersRepository);

@injectable()
export class UsersController {

    constructor(@inject(UserService) protected userService: UserService,
                @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
                @inject(UsersRepository) protected usersRepository: UsersRepository) {
    }


    async getUsers(req: RequestWithSearchTerms<QueryUsersRequestType>, res: Response) {
        const query: QueryUsersRequestType = req.query;

        const sortData: SortUsersRepositoryType = {
            sortBy: query.sortBy || "createdAt",
            sortDirection: query.sortDirection || "desc",
            pageNumber: query.pageNumber || 1,
            pageSize: query.pageSize || 10
        }
        const searchData: SearchUsersRepositoryType = {
            searchLoginTerm: query.searchLoginTerm || null,
            searchEmailTerm: query.searchEmailTerm || null
        }

        const users = await usersQueryRepository.getAllUsers(sortData, searchData);

        res.json(users)
    }

    async createUser(req: RequestWithBody<CreateUserType>, res: Response) {
        const createdUser: UserOutputType | null = await userService.createUser(req.body.login, req.body.email, req.body.password, true);

        if (!createdUser) {
            res.status(HTTP_STATUSES.BAD_REQUEST_400);
            return
        }
        res.status(HTTP_STATUSES.CREATED_201).json(createdUser);
    }


    async deleteUser(req: RequestWithParams<Params>, res: Response) {
        try{
            await usersRepository.deleteUser(req.params.id);
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        }catch (err){
            errorsHandler(res, err);
        }
    }
}




const errorsHandler = (res: Response, err: any) => {
    if (err.message === ERRORS.NOT_FOUND_404) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    } else {
        res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500);
    }
}

const ERRORS = {
    NOT_FOUND_404: "not_found",
    BAD_REQUEST_400: "bad_request"
}
