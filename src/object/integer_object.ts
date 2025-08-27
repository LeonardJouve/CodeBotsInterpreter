import {Hashable, ObjectType, type Object} from ".";
import {HashKey} from "./hash_key";

export default class IntegerObject implements Object, Hashable {
    public value: number;

    constructor(value: number) {
        this.value = value;
    }

    hashKey(): HashKey {
        return new HashKey(this.type(), String(this.value));
    }

    type(): ObjectType {
        return ObjectType.INTEGER;
    }

    inspect(): string {
        return String(this.value);
    }
}
