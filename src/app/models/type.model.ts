export interface InputType {
    id: string;
    label: string;
    value: any;
}

export interface TypeElement {
    id: string;
    typeNumber: number;
    inputList: InputType[];
    color: string;
    name: string;
}

export interface TypeOnBoard extends TypeElement {
    index: number;
}

export interface Connection {
    from: number; // indexes on the board
    to: number;
}