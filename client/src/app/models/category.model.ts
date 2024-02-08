export class Category {
  constructor(
    public _id: string,
    public name: string,
    public children: string[],
    public parent?: string,
  ) {}
}
