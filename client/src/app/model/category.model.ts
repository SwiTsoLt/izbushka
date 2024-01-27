export class Category {
    constructor(
        public _id: string,
        public name: string,
        public children: Category[],
        public parent?: string
    ) { }
}