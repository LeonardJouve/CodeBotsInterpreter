import {ObjectType, type Object} from ".";

export default class Null implements Object {
    constructor() {}

    type(): ObjectType {
        return ObjectType.NULL;
    }
    inspect(): string {
        return String(null);
    }
}
