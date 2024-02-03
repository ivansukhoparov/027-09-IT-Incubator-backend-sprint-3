import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../utils/comon";
import {SecurityQueryRepository} from "../repositories/security-query-repository";
import {Tokens} from "../common/utils/tokens";
import {Params, RequestWithParams} from "../types/common";
import {SecurityService} from "../domains/security-service";
import {SecurityController} from "./controllers/security-controller";
import {container} from "../composition-root";

export const securityRouter = Router()

const securityControllerInstance = container.resolve<SecurityController>(SecurityController);

securityRouter.get("/devices", securityControllerInstance.getDevices.bind(securityControllerInstance))

securityRouter.delete("/devices/:id", securityControllerInstance.terminateDevice.bind(securityControllerInstance))

securityRouter.delete("/devices", securityControllerInstance.terminateAllDevices.bind(securityControllerInstance))
