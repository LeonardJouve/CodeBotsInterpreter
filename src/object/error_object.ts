import {ObjectType, type Object} from ".";

export default class ErrorObject implements Object {
    public message: string;

    constructor(message: string) {
        this.message = message;
    }

    type(): ObjectType {
        return ObjectType.ERROR;
    }
    inspect(): string {
        return "ERROR: " + this.message;
    }
}
