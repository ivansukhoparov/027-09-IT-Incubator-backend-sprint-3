import request from "supertest";
import {app} from "../../../src/app";
import {UserOutputType} from "../../../src/types/users/output";
import {CreateUserType} from "../../../src/types/users/input";

type EntitiesType = "users" | "blogs" | "posts" | "comments" | "likes"

const entitiesFactory = {
	"users": (i: number, entityName: string = "user") => {
		return {
			login: entityName + "_" + i,
			email: entityName + i + "@gmail.com",
			password: "qwerty"
		};
	},
	"blogs": (i: number, entityName: string = "user") => {
		return {
			login: entityName + "_" + i,
			email: entityName + i + "@gmail.com",
			password: "qwerty"
		};
	},
	"posts": (i: number, entityName: string = "user") => {
		return {
			login: entityName + "_" + i,
			email: entityName + i + "@gmail.com",
			password: "qwerty"
		};
	},
	"comments": (i: number, entityName: string = "user") => {
		return {
			login: entityName + "_" + i,
			email: entityName + i + "@gmail.com",
			password: "qwerty"
		};
	},
	"likes": (i: number, entityName: string = "user") => {
		return {
			login: entityName + "_" + i,
			email: entityName + i + "@gmail.com",
			password: "qwerty"
		};
	},
};

export class CreateEntity {
	private entityType: EntitiesType;

	constructor(EntityType: EntitiesType) {
		this.entityType = EntityType;
	}

	async create(numberOfEntities: number, entityName?: string) {
		const entities: any[] = [];
		for (let i = 1; i <= numberOfEntities; i++) {
			let createEntityData: any;
			if (entityName) {
				createEntityData = entitiesFactory[this.entityType](i,entityName);
			} else {
				createEntityData = entitiesFactory[this.entityType](i);
			}
			const res = await request(app)
				.post("/" + this.entityType + "/")
				.auth("admin", "qwerty")
				.send(createEntityData);

			entities.push(res.body);

		}
		return entities;
	}
}



export const createUsers = async (numberOfUsers: number) => {

	const users:UserOutputType[] =[];
	for (let i = 1; i <= numberOfUsers; i++) {
		const createUserData:CreateUserType = {
			login: "user_" + i,
			email: "user" + i + "@gmail.com",
			password: "qwerty"
		};
		const res = await request(app)
			.post("/users/")
			.auth("admin", "qwerty")
			.send(createUserData);

		users.push(res.body);
	}

	return users;
};

export const createUserWithData = async (createUserData:any) => {

	const res = await request(app)
		.post("/users/")
		.auth("admin", "qwerty")
		.send(createUserData);

	return res.body;
};
