export class PostLocation {
    constructor(
        public areaID: string,
        public regionID: string
    ) {}
}

export class Post {
    constructor(
        public id: string,
        public title: string,
        public body: string,
        public images: string[],
        public categoryID: number,
        public ownerID: string,
        public location: PostLocation,
        public price: number,
        public publishDate: number,
    ) {}    
}