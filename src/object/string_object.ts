import {ObjectType, type Object} from ".";

export default class StringObject implements Object {
    public value: string;

    constructor(value: string) {
        this.value = value;
    }

    type(): ObjectType {
        return ObjectType.STRING;
    }
    inspect(): string {
        return this.value;
    }
}
