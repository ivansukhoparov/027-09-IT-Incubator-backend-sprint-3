import {Response, Router} from "express";
import {Params, RequestWithBody, RequestWithParams, RequestWithSearchTerms} from "../types/common";
import {
    CreateUserType,
    QueryUsersRequestType,
    SearchUsersRepositoryType,
    SortUsersRepositoryType
} from "../types/users/input";
import {UsersQueryRepository} from "../repositories/users-query-repository";
import {UserOutputType} from "../types/users/output";
import {UserService} from "../domains/user-service";
import {HTTP_STATUSES} from "../utils/comon";
import {AuthorizationMiddleware} from "../middlewares/auth/auth-middleware";
import {usersValidationChain} from "../middlewares/validators/users-validators";
import {inputValidationMiddleware} from "../middlewares/validators/input-validation-middleware";
import {UsersRepository} from "../repositories/users-repository";

export const usersRouter = Router();

const userService = new UserService();
const usersQueryRepository = new UsersQueryRepository();
const usersRepository = new UsersRepository();

usersRouter.get("/", async (req: RequestWithSearchTerms<QueryUsersRequestType>, res: Response) => {
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
})

usersRouter.post("/", AuthorizationMiddleware, usersValidationChain(),inputValidationMiddleware,  async (req:RequestWithBody<CreateUserType>, res:Response)=>{

    const createdUser: UserOutputType | null = await userService.createUser(req.body.login, req.body.email, req.body.password, true);
    if (!createdUser) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400);
        return
    }
    res.status(HTTP_STATUSES.CREATED_201).json(createdUser);
})

usersRouter.delete("/:id",AuthorizationMiddleware, async (req: RequestWithParams<Params>, res: Response) => {
    const isDeleted = await  usersRepository.deleteUser(req.params.id);
    if (!isDeleted) res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    else res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
