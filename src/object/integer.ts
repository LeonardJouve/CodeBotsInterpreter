import {ObjectType, type Object} from ".";

export default class Integer implements Object {
    public value: number;

    constructor(value: number) {
        this.value = value;
    }

    type(): ObjectType {
        return ObjectType.INTEGER;
    }
    inspect(): string {
        return String(this.value);
    }
}
