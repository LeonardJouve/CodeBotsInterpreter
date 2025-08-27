import {ObjectType, type Object} from ".";

export default class NullObject implements Object {
    public value: Object;

    constructor(value: Object) {
        this.value = value;
    }

    type(): ObjectType {
        return ObjectType.RETURN;
    }
    inspect(): string {
        return this.value.inspect();
    }
}
