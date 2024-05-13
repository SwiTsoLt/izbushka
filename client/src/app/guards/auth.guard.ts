import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "@models/user.model";
import { Store } from "@ngrx/store";
import { selectInfoReadyState } from "@store/info/info.selectors";
import { selectUser } from "@store/user/user.selectors";
import { Observable, zip } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class AuthGuard {
    private user$: Observable<User> =  this.store.select(selectUser as never);
    private isReady$: Observable<User> =  this.store.select(selectInfoReadyState as never);

    constructor(
        private readonly store: Store,
        private readonly router: Router
        ) { }

    canActivate(): Observable<boolean> {
        return new Observable((subscriber) => {
            zip(this.isReady$, this.user$)
            .subscribe(([isReady, user]) => {
                if (!isReady) return;
                if (user?._id) return subscriber.next(true);
                this.router.navigate(['/signin']);
                return subscriber.next(false);
            })
        })
    }
}