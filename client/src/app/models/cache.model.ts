import { Post } from "./post.model";
import { User } from "./user.model";

export class Cache {
    constructor(
        public user: Record<string, User>,
        public post: Record<string, Post>,
    ) {}
}