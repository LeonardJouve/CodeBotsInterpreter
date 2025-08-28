import BuiltinObject from "../object/builtin_object";
import ErrorObject from "../object/error_object";
import IntegerObject from "../object/integer_object";
import StringObject from "../object/string_object";
import ArrayObject from "../object/array_object";
import {NULL} from ".";

export const builtins: Record<string, BuiltinObject> = {
    "len": new BuiltinObject((...args) => {
        if (args.length !== 1) {
            return new ErrorObject(`wrong arguments amount: received ${args.length}, expected 1`);
        }

        const [arg] = args;

        switch (true) {
        case arg instanceof StringObject:
            return new IntegerObject(arg.value.length);
        case arg instanceof ArrayObject:
            return new IntegerObject(arg.elements.length);
        default:
            return new ErrorObject(`unsupported argument type for builtin function len: ${arg.type()}`);
        }
    }),
    "first": new BuiltinObject((...args) => {
        if (args.length !== 1) {
            return new ErrorObject(`wrong arguments amount: received ${args.length}, expected 1`);
        }

        const [arg] = args;

        if (!(arg instanceof ArrayObject)) {
            return new ErrorObject(`unsupported argument type for builtin function first: ${arg.type()}`);
        }

        if (!arg.elements.length) {
            return NULL;
        }

        return arg.elements[0];
	}),
	"last": new BuiltinObject((...args) => {
        if (args.length !== 1) {
            return new ErrorObject(`wrong arguments amount: received ${args.length}, expected 1`);
        }

        const [arg] = args;

        if (!(arg instanceof ArrayObject)) {
            return new ErrorObject(`unsupported argument type for builtin function last: ${arg.type()}`);
        }

        if (!arg.elements.length) {
            return NULL;
        }

        return arg.elements[arg.elements.length - 1];
	}),
	"rest": new BuiltinObject((...args) => {
        if (args.length !== 1) {
            return new ErrorObject(`wrong arguments amount: received ${args.length}, expected 1`);
        }

        const [arg] = args;

        if (!(arg instanceof ArrayObject)) {
            return new ErrorObject(`unsupported argument type for builtin function rest: ${arg.type()}`);
        }

        if (!arg.elements.length) {
            return NULL;
        }

        const elements = arg.elements.slice(1);

        return new ArrayObject(elements);
	}),
	"push": new BuiltinObject((...args) => {
        if (args.length !== 2) {
            return new ErrorObject(`wrong arguments amount: received ${args.length}, expected 2`);
        }

        const [array, element] = args;

        if (!(array instanceof ArrayObject)) {
            return new ErrorObject(`unsupported argument type for builtin function push: ${array.type()}`);
        }

        array.elements.push(element);

        return array;
	}),
};
