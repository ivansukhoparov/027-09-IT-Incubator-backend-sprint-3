import {NextFunction, Request, Response} from "express";
import {ApiRequestsRepository} from "../../repositories/api-requests-repository";
import {HTTP_STATUSES} from "../../utils/comon";
import {settings} from "../../settings";

const apiRequestsRepository = new ApiRequestsRepository();
export const apiRequestLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const ip = req.ip || "unknown";
	await apiRequestsRepository.writeRequest(ip, req.originalUrl);
	const requestCount = await apiRequestsRepository.countRequestByTime(ip, req.originalUrl, settings.requestLimit.interval);
	if (requestCount > settings.requestLimit.count) {
		res.sendStatus(HTTP_STATUSES.TOO_MANY_REQUESTS_429);
		return;
	} else {
		next();
	}
};
