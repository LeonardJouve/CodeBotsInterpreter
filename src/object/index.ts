export enum ObjectType {
    INTEGER = "INTEGER",
    BOOLEAN = "BOOLEAN",
    NULL = "NULL",
    RETURN = "RETURN",
    ERROR = "ERROR",
};

export interface Object {
    type(): ObjectType;
    inspect(): string;
};
