import BuiltinObject from "../object/builtin_object";
import ErrorObject from "../object/error_object";
import IntegerObject from "../object/integer_object";
import StringObject from "../object/string_object";
import type {Object} from "../object";

export const builtins: Record<string, BuiltinObject> = {
    "len": new BuiltinObject((...args: Object[]) => {
        if (args.length !== 1) {
            return new ErrorObject(`wrong arguments amount: received ${args.length}, expected 1`);
        }

        const [arg] = args;

        switch (true) {
        case arg instanceof StringObject:
            return new IntegerObject(arg.value.length);
        // case *object.Array:
        //     return &object.Integer{
        //         Value: int64(len(argument.Value)),
        //     }
        default:
            return new ErrorObject(`unsupported argument type for builtin function len: ${arg.type()}`);
        }
    }),
};
