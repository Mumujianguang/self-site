export interface INoteRecord {
    id: string;
    icon?: string;
    title: string;
}

export interface INotes {
    list: INoteRecord[];
}
