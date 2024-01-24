export class SubCategory {
    constructor(
        public _id: string,
        public parent_id: string,
        public name: string
    ) { }
}

export class Category {
    constructor(
        public _id: string,
        public name: string,
        public children: SubCategory[]
    ) { }
}