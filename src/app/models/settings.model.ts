import { FormControl } from "@angular/forms";

export interface Settings {
    maxConnectionNumber: number | null;
    allowedSelfConnection: boolean;
    saveDataInLocalStorage: boolean;
}

export type FormGroupFromObject<T> = {
    [Property in keyof T]: FormControl<T[Property]>;
};


export enum ValidationErrors {
    SAME_TYPE_CONNECTION = 'Connection with the same component is forbidden',
    MAX_CONNECTIONS_NUMBER = 'This type reached max connection number: ',
}

export enum ProgramErrors {
    LACK_OF_TYPE_ON_BOARD = 'Lack of the type with id:',
    LACK_OF_CANVAS_ELEMENT = 'Lack of canvas element',
    TYPE_NOT_CHOSE = 'You haven\'t choose any type to put on the board',
}