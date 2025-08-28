import {ObjectType, type Object} from ".";

export default class ArrayObject implements Object {
    public elements: Object[];

    constructor(elements: Object[]) {
        this.elements = elements;
    }

    type(): ObjectType {
        return ObjectType.ARRAY;
    }

    inspect(): string {
        return "[" + this.elements.map((element) => element.inspect()).join(", ") + "]";
    }
}
