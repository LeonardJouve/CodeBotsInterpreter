export enum ObjectType {
    INTEGER = "INTEGER",
    BOOLEAN = "BOOLEAN",
    NULL = "NULL",
    RETURN = "RETURN",
    ERROR = "ERROR",
    FUNCTION = "FUNCTION",
    STRING = "STRING",
    BUILTIN = "BUILTIN",
};

export interface Object {
    type(): ObjectType;
    inspect(): string;
};

export type BuiltinFunction = (...args: Object[]) => Object;
