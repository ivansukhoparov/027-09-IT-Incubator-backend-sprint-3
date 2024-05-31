import {ValidationError, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../../utils/comon";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {

	const result:ValidationError[] = validationResult(req).array({ onlyFirstError: true });
	// validationResult функция из экспресс валидатора которая из реквэста достает ошибки, которые сам же экспресс
	// валидатор туда положил
	// эта функия возвращает  экспресс валидаторорский объект Result
	//.array() - метод объекта Result который превращает его в массив
	// { onlyFirstError: true } - это параметры для метода .array(), в нанном случае это означает, что надо вернуть
	// только первую ошибку;

	// потом мы мапим массив ошибок в нужный нам формат и оплучам массив вида
	//  [{message: "oshibka v dline", field: "title"},{message: "oshibka v dline", field: "description"}]
	const errorsMessages = result.map(error => {
		switch (error.type) {
		case "field":
			return {
				message: error.msg,
				field: error.path
			};
		default:
			return {
				message: error.msg,
				field: "unknown error"
			};
		}
	});

	// и записываем этот массив в поле errorsMessages объекта, который будем отдавать
	const errors = {errorsMessages:errorsMessages};

	if (errors.errorsMessages.length>0) {
		// проверяем длину массива с ошибками, если она больше 0, значит ошибки есть и отправляем из со статусом 400
		res.status(HTTP_STATUSES.BAD_REQUEST_400).json(errors);
	} else {
		// Если нет, передаем управление следующей функции
		next();
	}
};



