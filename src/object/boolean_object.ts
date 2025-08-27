import {type Hashable, ObjectType, type Object} from ".";
import { HashKey } from "./hash_key";

export default class BooleanObject implements Object, Hashable {
    public value: boolean;

    constructor(value: boolean) {
        this.value = value;
    }

    hashKey(): HashKey {
        return new HashKey(this.type(), this.value ? "1" : "0");
    }

    type(): ObjectType {
        return ObjectType.BOOLEAN;
    }

    inspect(): string {
        return String(this.value);
    }
}
