import { Injectable } from "@angular/core";
import { User } from "./user.model";
import { StaticDataSource } from "./static.datasource";
import { Observable, map } from "rxjs";


@Injectable()
export class UserRepository {

    constructor(public dataSource: StaticDataSource) {}

    public getUsers(): Observable<User[]> {
        return this.dataSource.getUsers()
    }

    public getUser(id: string): Observable<User | undefined> {
        return this.dataSource.getUser(id)
            .pipe(map((user: User | undefined) => {
                if (!user) return undefined;
                if (!this.isUserValid(user)) return undefined;
                return user;
            }))
    }

    // Private

    private isUserValid(user: User): boolean {
        return !!user
    }
}