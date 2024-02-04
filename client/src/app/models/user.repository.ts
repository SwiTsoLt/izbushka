import { Injectable } from "@angular/core";
import { User } from "./user.model";
import { StaticDataSource } from "./static.datasource";
import { Observable, map } from "rxjs";
import { UserService } from "@services/user.service";


@Injectable()
export class UserRepository {

    constructor(
        private readonly dataSource: StaticDataSource,
        private readonly userService: UserService
        ) {}

    public getUsers(): Observable<User[]> {
        return this.dataSource.getUsers()
    }

    public getUser(id: string): Observable<User | null> {
        return this.userService.getUserById(id)
    }
}