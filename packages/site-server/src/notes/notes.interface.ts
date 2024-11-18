export interface INoteRecord {
    id: string;
    icon?: string;
    title: string;
}

export interface INoteDetailRecord extends INoteRecord {
    content: string;
    summary: string;
}

export interface INotes {
    list: INoteRecord[];
    detailList: INoteDetailRecord[];
}
