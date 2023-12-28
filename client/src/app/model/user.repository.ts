import { Injectable } from "@angular/core";
import { User } from "./user.model";
import { StaticDataSource } from "./static.datasource";


@Injectable()
export class UserRepository {
    private users: User[] = []

    constructor(dataSource: StaticDataSource) {
        dataSource.getUsers().subscribe(data => {
            this.users = data
        })
    }

    public getUsers(): User[] {
        return this.users
    }

    public getUser(id: string): User | undefined {
        return this.users.find(user => user.id === id)
    }
}