export interface IMobileOptionItem {
    id: string;
    name: string;
    children: IMobileOptionItem[];
}

export interface IMobileSelectOptionEvent<T> {
    id: string,
    value: T,
}