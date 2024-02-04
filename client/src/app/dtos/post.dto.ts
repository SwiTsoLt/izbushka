export class CreatePostDTO {
    constructor(
        public title?: string,
        public body?: string,
        public images?: FileList,
        public category?: string,
        public location?: string,
        public price?: number | null,
    ) { }
}

export class UpdatePostDTO {
    constructor(
        public title?: string,
        public body?: string,
        public images?: string[],
        public category?: string,
        public location?: string,
        public price?: number,
    ) { }
}
