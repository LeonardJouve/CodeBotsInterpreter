export enum ObjectType {
    INTEGER = "INTEGER",
    BOOLEAN = "BOOLEAN",
    NULL = "NULL",
    RETURN = "RETURN",
    ERROR = "ERROR",
    FUNCTION = "FUNCTION",
    STRING = "STRING",
};

export interface Object {
    type(): ObjectType;
    inspect(): string;
};
