import {ObjectType, type Object} from ".";

export default class BooleanObject implements Object {
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
