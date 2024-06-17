import { FormControl } from "@angular/forms";

export interface Settings {
    maxConnectionNumber: number | null;
    allowedSelfConnection: boolean;

}

export type FormGroupFromObject<T> = {
    [Property in keyof T]: FormControl<T[Property]>;
};


export enum ValidationErrors {
    SAME_TYPE_CONNECTION = 'Connection to the same component is forbidden',
    MAX_CONNECTIONS_NUMBER = 'This type reached max connection number: ',
}