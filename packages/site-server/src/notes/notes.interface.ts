export interface INoteRecord {
    id: string;
    src: string;
    icon: string;
    title: string;
}

export interface INotes {
    list: INoteRecord[];
}
