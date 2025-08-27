import {ObjectType} from ".";
import type {HashPair} from "./hash_key";

export default class HashObject implements Object {
    public pairs: Map<string, HashPair>;

    constructor(pairs: Map<string, HashPair>) {
        this.pairs = pairs;
    }

    type(): ObjectType {
        return ObjectType.HASH;
    }

    inspect(): string {
        return "{" + Array.from(this.pairs.entries()).map(([_, {key, value}]) => key.inspect() + ": " + value.inspect()).join(", ") + "}";
    }
}
