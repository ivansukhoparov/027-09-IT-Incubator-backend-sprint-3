import dotenv from "dotenv";
import {settings} from "../../../../settings";

dotenv.config();

export const emailFrom = {
	registrationService: "\"no-reply bloggers platform\" <sukhoparov.ivan@gmail.com>",
	passwordRecoveryService: "\"no-reply bloggers platform\" <no-reply@bggpf.com>"
};

export const transporterOption = {
	service: "gmail",
	auth: {
		user: settings.env.emailLogin,
		pass: settings.env.emailPassword
	},
	tls: {
		// do not fail on invalid certs
		rejectUnauthorized: false
	},
};
