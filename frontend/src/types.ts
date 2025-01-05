export interface Category {
    id: string;
    name: string;
}

export interface Subcategory {
    id: string;
    category_id: string;
    name: string;
}

export interface Item {
    id: string;
    subcategory_id: string;
    name: string;
    path: string;
}
