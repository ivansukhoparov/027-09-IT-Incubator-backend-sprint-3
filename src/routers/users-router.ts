import {Router} from "express";
import {AuthorizationMiddleware} from "../middlewares/auth/auth-middleware";
import {usersValidationChain} from "../middlewares/validators/users-validators";
import {inputValidationMiddleware} from "../middlewares/validators/input-validation-middleware";
import {container} from "../composition-root";
import {UsersController} from "./controllers/users-controller";

export const usersRouter = Router();

const userController = container.resolve<UsersController>(UsersController);


usersRouter.get("/", userController.getUsers.bind(userController))

usersRouter.post("/", AuthorizationMiddleware,
    usersValidationChain(),
    inputValidationMiddleware,
    userController.createUser.bind(userController))

usersRouter.delete("/:id",AuthorizationMiddleware, userController.deleteUser.bind(userController))
