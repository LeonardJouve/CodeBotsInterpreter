import fnv from "fnv-plus";
import {Hashable, ObjectType, type Object} from ".";
import {HashKey} from "./hash_key";

export default class StringObject implements Object, Hashable {
    public value: string;

    constructor(value: string) {
        this.value = value;
    }

    hashKey(): HashKey {
        return new HashKey(this.type(), fnv.hash(this.value, 64).dec());
    }

    type(): ObjectType {
        return ObjectType.STRING;
    }

    inspect(): string {
        return this.value;
    }
}
