import { Injectable } from "@angular/core";
import { Post, PostLocation } from "./post.model";
import { Observable } from "rxjs";
import { User, UserLocation } from "./user.model";

@Injectable()
export class StaticDataSource {
    private readonly day = 24 * 60 * 60 * 1000;

    private posts: Post[] = [
        new Post("1", "Title 1", "Body 1", ["https://i.bulavka.by/lots47/200/477684.webp", "image2", "image3"], 1, "1", new PostLocation("1", "1"), 10, Date.now() - this.day),
        new Post("2", "Title 2", "Body 2", ["https://i.bulavka.by/lots47/200/476738.webp", "image2", "image3"], 2, "2", new PostLocation("2", "1"), 20, Date.now() - 2 * this.day),
        new Post("3", "Кирпич б/у керамический", "Body 3", ["https://i.bulavka.by/lots47/200/475382.webp", "image2", "image3"], 3, "3", new PostLocation("1", "2"), 30, Date.now() - 3 * this.day),
        new Post("4", "Title 4", "Body 4", ["https://i.bulavka.by/lots47/200/474425.webp", "image2", "image3"], 2, "2", new PostLocation("2", "2"), 40, Date.now() - 4 * this.day),
        new Post("5", "Title 5", "Body 5", ["https://i.bulavka.by/lots47/200/474847-1.webp", "image2", "image3"], 1, "1", new PostLocation("3", "1"), 50, Date.now() - 5 * this.day),
        new Post("6", "Title 6", "Body 6", ["https://instrument.by/pics/items/3165140371902_app1.jpg"], 3, "3", new PostLocation("1", "3"), 60, Date.now() - 6 * this.day),
        new Post("7", "Title 7", "Body 7", ["https://i.bulavka.by/lots47/200/472919.webp", "image2", "image3"], 3, "3", new PostLocation("2", "3"), 70, Date.now() - 7 * this.day),
        new Post("8", "Title 8", "Body 8", ["https://i.bulavka.by/lots47/200/471499.webp", "image2", "image3"], 2, "2", new PostLocation("1", "1"), 80, Date.now() - 8 * this.day),
        new Post("8", "Title 9", "Body 9", ["https://i.bulavka.by/lots47/200/470759.webp", "image2", "image3"], 2, "2", new PostLocation("3", "2"), 90, Date.now() - 9 * this.day),
        new Post("10", "Title 10", "Body 10", ["../../assets/pages/home/test-image.gif", "image2", "image3"], 1, "1", new PostLocation("2", "1"), 100, Date.now() - 10 * this.day),
    ]

    private users: User[] = [
         new User("1", "1example@gmail.com", "+37529xxxxxx1", "Alex", "Smirnov", "avatar1", 0, ["1", "3"], [], new UserLocation("1", "1"), new Date(2022, 5, 20, 3, 5, 0).getMilliseconds()),
         new User("2", "2example@gmail.com", "+37529xxxxxx2", "Leonid", "Bagaev", "avatar2", 0, ["2", "4"], [], new UserLocation("2", "1"), new Date(2021, 7, 23, 3, 5, 30).getMilliseconds()),
         new User("3", "3example@gmail.com", "+37529xxxxxx3", "Nikita", "Tisevich", "avatar3", 0, ["5", "6"], [], new UserLocation("1", "2"), new Date(2019, 2, 25, 3, 6, 0).getMilliseconds()),
         new User("4", "4example@gmail.com", "+37529xxxxxx4", "Vlad", "Stepanov", "avatar4", 0, ["7", "9"], [], new UserLocation("3", "1"), new Date(2020, 12, 12, 3, 6, 30).getMilliseconds()),
         new User("5", "5example@gmail.com", "+37529xxxxxx5", "Andrey", "Vladimirov", "avatar5", 0, ["8", "10"], [], new UserLocation("1", "3"), new Date(2023, 8, 20, 3, 7, 0).getMilliseconds()),
    ]

    public getPosts(): Observable<Post[]> {
        return new Observable(subscriber => {
            setTimeout(() => {
                subscriber.next(this.posts)
            }, 100)
        })
    }

    public getPost(id: string): Observable<Post | undefined> {
        return new Observable(subscriber => {
            setTimeout(() => {
                subscriber.next(this.posts.find(p => p.id === id))
            }, 100)
        })
    }

    public getUsers(): Observable<User[]> {
        return new Observable(subscriber => {
            setTimeout(() => {
                subscriber.next(this.users)
            }, 100)
        })
    }

    public getUser(id: string): Observable<User | undefined> {
        return new Observable(subscriber => {
            setTimeout(() => {
                subscriber.next(this.users.find(u => u._id === id))
            }, 100)
        })
    }
}