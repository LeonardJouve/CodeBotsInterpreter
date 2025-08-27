import {type BuiltinFunction, ObjectType, type Object} from ".";

export default class BuiltinObject implements Object {
    public func: BuiltinFunction;

    constructor(func: BuiltinFunction) {
        this.func = func;
    }

    type(): ObjectType {
        return ObjectType.BUILTIN;
    }
    inspect(): string {
        return "builtin function";
    }
}
