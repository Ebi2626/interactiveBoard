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
    instanceId: string;
}

export interface Connection {
    from: string; // instanceId from TypeOnBoard
    to: string;
}