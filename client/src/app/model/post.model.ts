export class PostLocation {
    constructor(
        public area: string,
        public region: string
    ) {}
}

export class Post {
    constructor(
        public _id: string,
        public title: string,
        public body: string,
        public images: string[],
        public category: number,
        public owner: string,
        public location: PostLocation,
        public price: number,
        public publishDate: number,
    ) {}    
}