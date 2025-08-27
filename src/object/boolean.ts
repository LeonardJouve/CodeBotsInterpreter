import {ObjectType, type Object} from ".";

export default class Boolean implements Object {
    public value: boolean;

    constructor(value: boolean) {
        this.value = value;
    }

    type(): ObjectType {
        return ObjectType.BOOLEAN;
    }
    inspect(): string {
        return String(this.value);
    }
}
