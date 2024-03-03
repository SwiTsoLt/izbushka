import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { User } from "@models/user.model";
import { Store } from "@ngrx/store";
import { selectUser } from "@store/user/user.selectors";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
    private user$: Observable<User> =  this.store.select(selectUser as never);

    constructor(
        private readonly store: Store,
        private readonly router: Router
        ) { }

    canActivate(): Observable<boolean> {
        return new Observable((subscriber) => {
            this.user$.subscribe((user: User) => {
                if (user?._id) return subscriber.next(true);
                this.router.navigate(['/signin']);
                return subscriber.next(false);
            })
        })
    }
}