import type {Hashable, Object, ObjectType} from ".";

export type HashPair = {
    key: Object;
    value: Object;
};

export class HashKey {
    public type: ObjectType;
    public value: string;

    constructor(type: ObjectType, value: string) {
        this.type = type;
        this.value = value;
    }

    toString(): string {
        return this.type + ":" + this.value;
    }
}

export const isHashable = (object: any): object is Hashable => {
    return typeof object.hashKey === "function";
};
