import {NextFunction, Request, Response} from "express";
import {btoa} from "buffer";
import {AUTH_METHODS, HTTP_STATUSES} from "../../utils/comon";
import {AuthService} from "../../domains/auth-service";
import {UsersRepository} from "../../repositories/users-repository";
import {CommentsQueryRepository} from "../../repositories/comments-query-repository";
import dotenv from "dotenv";

dotenv.config();

const login = process.env.SUPERADMIN_LOGIN!;
const password = process.env.SUPERADMIN_PASSWORD!;


// basic
export const AuthorizationMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.header("authorization")?.split(" "); // Получаем значение поля в заголовке
    if (authHeader) {
        const authMethod = authHeader[0]; // получаем метод из заголовка
        const authInput = authHeader[1] // получаем значение для авторизации из заголовка


        if (authMethod === AUTH_METHODS.base) {  // If authorisation method is BASE64

            const auth = btoa(`${login}:${password}`); // кодируем наши логин и пароль в basic64

            if (authInput === auth) {  // сравниваем нашу пару логин:пароль пришедшей в заголовке реквеста
                next();
            } else {
                res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
                return;
            }

        } else if (authMethod === AUTH_METHODS.bearer) { // If authorisation method is BEARER

            const userId = await AuthService.getUserIdByToken(authInput);

            if (!userId) {
                res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
                return;
            }

            const user = await UsersRepository.getUserById(userId);

            if (!user) {
                res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
                return;
            }

            req.user = user;
            next()
        }

    } else {
        // в противном случае отправляем ошибку 401
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
    }

}

export const accessRight = async (req:Request, res:Response, next: NextFunction)=>{

    const comment = await CommentsQueryRepository.getCommentById(req.params.id)
    if (!comment){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    const ownerId = comment.commentatorInfo.userId;
    if (ownerId !== req.user.id) {
        res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
        return;
    }
    next();
}
