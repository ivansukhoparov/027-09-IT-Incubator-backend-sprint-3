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
	"blogs": (i: number, entityName: string = "blog") => {
		return {
			name: entityName + "_" + i,
			description: "some valid description for " + entityName + "_" + i,
			websiteUrl: "http://www." + entityName + "inweb.com"
		};
	},
	"posts": (i: number, entityName: string = "post", parentId?: string,) => {
		if (parentId) {
			return {
				title: entityName + "_" + i + "_title",
				shortDescription: "a very short description for " + entityName + "_" + i,
				content: "some valid content for " + entityName + "_" + i,
				blogId: parentId!
			};
		} else {
			return {
				title: entityName + "_" + i + "_title",
				shortDescription: "a very short description for " + entityName + "_" + i,
				content: "some valid content for " + entityName + "_" + i,
			};
		}
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

	async create(numberOfEntities: number, entityName?: string, parentId?: string) {
		const entities: any[] = [];

		for (let i = 1; i <= numberOfEntities; i++) {
			let createEntityData: any;
			if (entityName && !parentId) {
				createEntityData = entitiesFactory[this.entityType](i,entityName);
			} else if (entityName && parentId) {
				createEntityData = entitiesFactory[this.entityType](i, entityName, parentId);
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
