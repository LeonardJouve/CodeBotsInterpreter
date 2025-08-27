export enum ObjectType {
    INTEGER = "INTEGER",
    BOOLEAN = "BOOLEAN",
    NULL = "NULL",
};

export interface Object {
    type(): ObjectType;
    inspect(): string;
};
