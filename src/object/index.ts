import type {HashKey} from "./hash_key";

export enum ObjectType {
    INTEGER = "INTEGER",
    BOOLEAN = "BOOLEAN",
    NULL = "NULL",
    RETURN = "RETURN",
    ERROR = "ERROR",
    FUNCTION = "FUNCTION",
    STRING = "STRING",
    BUILTIN = "BUILTIN",
    ARRAY = "ARRAY",
    HASH = "HASH",
};

export interface Object {
    type(): ObjectType;
    inspect(): string;
};

export interface Hashable {
    hashKey(): HashKey;
};

export type BuiltinFunction = (...args: Object[]) => Promise<Object>;
