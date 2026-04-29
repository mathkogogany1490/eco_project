

// export interface Contract {
//     id: number;
//     name: string;
//     type: string;
//     company: string;
// }



export interface Contract {
    id: number;
    name: string;
    type: string;
    company: string;
    created_at: string;
}

export interface ContractState {
    items: Contract[];
    loading: boolean;
}

export interface ContractType {
    id: number;
    name: string;
    type: string;
    company: string;
    created_at: string;
}