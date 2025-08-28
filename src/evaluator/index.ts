import ExpressionStatement from "../ast/expression_statement";
import IntegerExpression from "../ast/integer_expression";
import Program from "../ast/program";
import type {Expression, Node} from "../ast";
import {ObjectType, type Object} from "../object";
import IntegerObject from "../object/integer_object";
import NullObject from "../object/null_object";
import BooleanExpression from "../ast/boolean_expression";
import BooleanObject from "../object/boolean_object";
import ReturnObject from "../object/return_object";
import PrefixExpression from "../ast/prefix_expression";
import InfixExpression from "../ast/infix_expression";
import BlockStatement from "../ast/block_statement";
import IfExpression from "../ast/if_expression";
import ReturnStatement from "../ast/return_statement";
import ErrorObject from "../object/error_object";
import VarStatement from "../ast/var_statement";
import Environment from "../environment";
import IdentifierExpression from "../ast/identifier_expression";
import FunctionExpression from "../ast/function_expression";
import FunctionObject from "../object/function_object";
import CallExpression from "../ast/call_expression";
import StringExpression from "../ast/string_expression";
import StringObject from "../object/string_object";
import Builtins from "./builtins";
import BuiltinObject from "../object/builtin_object";
import ArrayExpression from "../ast/array_expression";
import ArrayObject from "../object/array_object";
import IndexExpression from "../ast/index_expression";
import HashExpression from "../ast/hash_expression";
import {isHashable, type HashPair} from "../object/hash_key";
import HashObject from "../object/hash_object";
import WhileExpression from "../ast/while_expression";

export const TRUE = new BooleanObject(true);
export const FALSE = new BooleanObject(false);
export const NULL = new NullObject();

export const evaluate = (node: Node, environment: Environment, builtins: Builtins): Object => {
    switch (true) {
    case node instanceof Program:
        return evaluateProgram(node, environment, builtins);
    case node instanceof ExpressionStatement:
        return evaluate(node.expression, environment, builtins);
    case node instanceof IntegerExpression:
        return new IntegerObject(node.value);
    case node instanceof BooleanExpression:
        return node.value ? TRUE : FALSE;
    case node instanceof PrefixExpression: {
        const right = evaluate(node.right, environment, builtins);
        if (isError(right)) {
            return right;
        }

        return evaluatePrefixExpression(node.operator, right);
    }
    case node instanceof InfixExpression: {
        const left = evaluate(node.left, environment, builtins);
        if (isError(left)) {
            return left;
        }

        const right = evaluate(node.right, environment, builtins);
        if (isError(right)) {
            return right;
        }

        return evaluateInfixExpression(node.operator, left, right);
    }
    case node instanceof BlockStatement:
        return evaluateBlockStatement(node, environment, builtins);
    case node instanceof IfExpression:
        return evaluateIfExpression(node, environment, builtins);
    case node instanceof ReturnStatement: {
        const value = evaluate(node.value, environment, builtins);
        if (isError(value)) {
            return value;
        }

        return new ReturnObject(value);
    }
    case node instanceof VarStatement: {
        const value = evaluate(node.value, environment, builtins);
        if (isError(value)) {
            return value;
        }

        environment.set(node.name.value, value);

        return value;
    }
    case node instanceof IdentifierExpression:
        return evaluateIdentifierExpression(node, environment, builtins);
    case node instanceof FunctionExpression:
        return new FunctionObject(node.parameters, node.body, environment);
    case node instanceof CallExpression: {
        const func = evaluate(node.func, environment, builtins);
        if (isError(func)) {
            return func;
        }

        const args = evaluateExpressions(node.args, environment, builtins);
        if (args.length === 1 && isError(args[0])) {
            return args[0];
        }

        return evaluateCallExpression(func, args, builtins);
    }
    case node instanceof StringExpression:
        return new StringObject(node.value);
    case node instanceof ArrayExpression: {
        const elements = evaluateExpressions(node.elements, environment, builtins);
        if (elements.length === 1 && isError(elements[0])) {
            return elements[0];
        }

        return new ArrayObject(elements);
    }
    case node instanceof IndexExpression: {
        const left = evaluate(node.left, environment, builtins);
        if (isError(left)) {
            return left;
        }

        const index = evaluate(node.index, environment, builtins);
        if (isError(index)) {
            return index;
        }

        return evaluateIndexExpression(left, index);
    }
    case node instanceof HashExpression:
        return evaluateHashExpression(node, environment, builtins);
    case node instanceof WhileExpression:
        return evaluateWhileExpression(node, environment, builtins);
    default:
        return NULL;
    }
};

const isError = (object: Object): boolean => {
    return object.type() === ObjectType.ERROR;
}

const evaluateProgram = (program: Program, environment: Environment, builtins: Builtins): Object => {
    let result = NULL;

    for (let i = 0; i < program.statements.length; ++i) {
        result = evaluate(program.statements[i], environment, builtins);

        if (result instanceof ReturnObject) {
            return result.value;
        } else if (result instanceof ErrorObject) {
            return result;
        }
    }

    return result;
};

const evaluateBlockStatement = (blockStatement: BlockStatement, environment: Environment, builtins: Builtins): Object => {
    let result = NULL;

    for (let i = 0; i < blockStatement.statements.length; ++i) {
        result = evaluate(blockStatement.statements[i], environment, builtins);

        if (result instanceof ReturnObject || result instanceof ErrorObject) {
            return result;
        }
    }

    return result;
};

const evaluatePrefixExpression = (operator: string, right: Object): Object => {
    switch (operator) {
    case "!":
        return evaluateBangOperator(right);
    case "-":
        return evaluateMinusOperator(right);
    default:
        return new ErrorObject(`unknown operation: ${operator}${right.type}`);
    }
};

const isTruthy = (object: Object): boolean => {
    const isFalsy =
        object === NULL ||
        object === FALSE ||
        (object instanceof IntegerObject && !object.value);

    return !isFalsy;
};

const evaluateBangOperator = (right: Object): Object => {
    return isTruthy(right) ? FALSE : TRUE;
};

const evaluateMinusOperator = (right: Object) => {
    if (!(right instanceof IntegerObject)) {
        return new ErrorObject(`unknown operation: -${right.type()}`);
    }

    return new IntegerObject(-right.value);
};

const evaluateInfixExpression = (operator: string, left: Object, right: Object): Object => {
    switch (true) {
    case left.type() !== right.type():
        return new ErrorObject(`type mismatch: ${left.type()} ${operator} ${right.type()}`)
    case left instanceof IntegerObject && right instanceof IntegerObject:
        return evaluateIntegerInfixExpression(operator, left, right);
    case left instanceof StringObject && right instanceof StringObject:
        return evaluateStringInfixExpression(operator, left, right);
    case operator === "==":
        return left === right ? TRUE : FALSE;
    case operator === "!=":
        return left !== right ? TRUE : FALSE;
    default:
        return new ErrorObject(`unknown operation: ${left.type()} ${operator} ${right.type()}`);
    }
};

const evaluateIntegerInfixExpression = (operator: string, left: IntegerObject, right: IntegerObject): Object => {
    switch (operator) {
    case "+":
        return new IntegerObject(left.value + right.value);
    case "-":
        return new IntegerObject(left.value - right.value);
    case "*":
        return new IntegerObject(left.value * right.value);
    case "/":
        return new IntegerObject(left.value / right.value);
    case "<":
        return left.value < right.value ? TRUE : FALSE;
    case ">":
        return left.value > right.value ? TRUE : FALSE;
    case "==":
        return left.value === right.value ? TRUE : FALSE;
    case "!=":
        return left.value !== right.value ? TRUE : FALSE;
    default:
        return new ErrorObject(`unknown operation: ${left.type()} ${operator} ${right.type()}`);
    }
};

const evaluateStringInfixExpression = (operator: string, left: StringObject, right: StringObject): Object => {
    switch (operator) {
    case "+":
        return new StringObject(left.value + right.value);
    default:
        return new ErrorObject(`unknown operation: ${left.type()} ${operator} ${right.type()}`);
    }
};

const evaluateIfExpression = (expression: IfExpression, environment: Environment, builtins: Builtins): Object => {
    const condition = evaluate(expression.condition, environment, builtins);
    if (isError(condition)) {
        return condition;
    }

    if (isTruthy(condition)) {
        return evaluate(expression.consequence, environment, builtins);
    } else if (expression.alternative) {
        return evaluate(expression.alternative, environment, builtins);
    } else {
        return NULL;
    }
};

const evaluateIdentifierExpression = (expression: IdentifierExpression, environment: Environment, builtins: Builtins): Object => {
    const value = environment.get(expression.value);
    if (value) {
        return value;
    }

    const builtin = builtins.get(expression.value);
    if (builtin) {
        return builtin;
    }

    return new ErrorObject(`identifier not found: ${expression.value}`);
};

const evaluateExpressions = (expressions: Expression[], environment: Environment, builtins: Builtins): Object[] => {
    const result = [];

    for (let i = 0; i < expressions.length; ++i) {
        const evaluation = evaluate(expressions[i], environment, builtins);
        if (isError(evaluation)) {
            return [evaluation];
        }

        result.push(evaluation);
    }

    return result;
};

const evaluateCallExpression = (func: Object, args: Object[], builtins: Builtins): Object => {
    switch (true) {
    case func instanceof FunctionObject: {
        if (func.parameters.length !== args.length) {
            return new ErrorObject(`wrong arguments amount: received ${args.length}, expected ${func.parameters.length}`)
        }

        const extendedEnvironment = extendFunctionEnvironment(func, args);
        const evaluation = evaluate(func.body, extendedEnvironment, builtins);

        return unwrapReturnValue(evaluation);
    }
    case func instanceof BuiltinObject:
        return func.func(...args);
    default:
        return new ErrorObject(`not a function: ${func.type()}`)
    }
};

const evaluateIndexExpression = (left: Object, index: Object): Object => {
    switch (true) {
    case left instanceof ArrayObject && index instanceof IntegerObject:
        return evaluateArrayIndexExpression(left, index);
    case left instanceof HashObject:
        return evaluateHashIndexExpression(left, index);
    default:
        return new ErrorObject(`index operator not supported: ${left.type()}`);
    }
};

const evaluateHashIndexExpression = (left: HashObject, index: Object): Object => {
    if (!isHashable(index)) {
        return new ErrorObject(`unusable as hash key: ${index.type()}`);
    }

    const pair = left.pairs.get(index.hashKey().toString());
    if (!pair) {
        return NULL;
    }

    return pair.value;
};

const evaluateArrayIndexExpression = (left: ArrayObject, index: IntegerObject): Object => {
    if (index.value < 0 || index.value >= left.elements.length) {
        return NULL;
    }

    return left.elements[index.value];
};

const evaluateHashExpression = (node: HashExpression, environment: Environment, builtins: Builtins): Object => {
    const pairs = new Map<string, HashPair>();

    for (const [nodeKey, nodeValue] of node.pairs) {
        const key = evaluate(nodeKey, environment, builtins);
        if (isError(key)) {
            return NULL;
        }

        if (!isHashable(key)) {
            return new ErrorObject(`unusable as hash key: ${key.type()}`);
        }

        const value = evaluate(nodeValue, environment, builtins);
        if (isError(value)) {
            return NULL;
        }

        pairs.set(key.hashKey().toString(), {key, value});
    }

    return new HashObject(pairs);
};

const evaluateWhileExpression = (node: WhileExpression, environment: Environment, builtins: Builtins): Object => {
    let result: Object|null = null;

    while (true) {
        const condition = evaluate(node.condition, environment, builtins);
        if (!isTruthy(condition)) {
            break;
        }

        result = evaluateBlockStatement(node.body, environment, builtins);
        if (isError(result) || result instanceof ReturnObject) {
            return result;
        }
    }

    if (!result) {
        return NULL;
    }

    return result;
};

const extendFunctionEnvironment = (func: FunctionObject, args: Object[]): Environment => {
    const extendedEnvironment = new Environment(func.environment);

    func.parameters.forEach((parameter, i) => {
        extendedEnvironment.set(parameter.value, args[i]);
    });

    return extendedEnvironment;
};

const unwrapReturnValue = (object: Object): Object => {
    if (object instanceof ReturnObject) {
        return object.value;
    }

    return object;
};
