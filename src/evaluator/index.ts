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
import {builtins} from "./builtins";
import BuiltinObject from "../object/builtin_object";

export const TRUE = new BooleanObject(true);
export const FALSE = new BooleanObject(false);
export const NULL = new NullObject();

export const evaluate = (node: Node, environment: Environment): Object => {
    switch (true) {
    case node instanceof Program:
        return evaluateProgram(node, environment);
    case node instanceof ExpressionStatement:
        return evaluate(node.expression, environment);
    case node instanceof IntegerExpression:
        return new IntegerObject(node.value);
    case node instanceof BooleanExpression:
        return node.value ? TRUE : FALSE;
    case node instanceof PrefixExpression: {
        const right = evaluate(node.right, environment);
        if (isError(right)) {
            return right;
        }

        return evaluatePrefixExpression(node.operator, right);
    }
    case node instanceof InfixExpression: {
        const left = evaluate(node.left, environment);
        if (isError(left)) {
            return left;
        }

        const right = evaluate(node.right, environment);
        if (isError(right)) {
            return right;
        }

        return evaluateInfixExpression(node.operator, left, right);
    }
    case node instanceof BlockStatement:
        return evaluateBlockStatement(node, environment);
    case node instanceof IfExpression:
        return evaluateIfExpression(node, environment);
    case node instanceof ReturnStatement: {
        const value = evaluate(node.value, environment);
        if (isError(value)) {
            return value;
        }

        return new ReturnObject(value);
    }
    case node instanceof VarStatement: {
        const value = evaluate(node.value, environment);
        if (isError(value)) {
            return value;
        }

        environment.set(node.name.value, value);

        return value;
    }
    case node instanceof IdentifierExpression:
        return evaluateIdentifierExpression(node, environment);
    case node instanceof FunctionExpression:
        return new FunctionObject(node.parameters, node.body, environment);
    case node instanceof CallExpression: {
        const func = evaluate(node.func, environment);
        if (isError(func)) {
            return func;
        }

        const args = evaluateExpressions(node.args, environment);
        if (args.length === 1 && isError(args[0])) {
            return args[0];
        }

        return evaluateCallExpression(func, args);
    }
    case node instanceof StringExpression:
        return new StringObject(node.value);
    default:
        return NULL;
    }
};

const isError = (object: Object): boolean => {
    return object.type() === ObjectType.ERROR;
}

const evaluateProgram = (program: Program, environment: Environment): Object => {
    let result = NULL;

    for (let i = 0; i < program.statements.length; ++i) {
        result = evaluate(program.statements[i], environment);

        if (result instanceof ReturnObject) {
            return result.value;
        } else if (result instanceof ErrorObject) {
            return result;
        }
    }

    return result;
};

const evaluateBlockStatement = (blockStatement: BlockStatement, environment: Environment): Object => {
    let result = NULL;

    for (let i = 0; i < blockStatement.statements.length; ++i) {
        result = evaluate(blockStatement.statements[i], environment);

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

const evaluateIfExpression = (expression: IfExpression, environment: Environment): Object => {
    const condition = evaluate(expression.condition, environment);
    if (isError(condition)) {
        return condition;
    }

    if (isTruthy(condition)) {
        return evaluate(expression.consequence, environment);
    } else if (expression.alternative) {
        return evaluate(expression.alternative, environment);
    } else {
        return NULL;
    }
};

const evaluateIdentifierExpression = (expression: IdentifierExpression, environment: Environment): Object => {
    const value = environment.get(expression.value);
    if (value) {
        return value;
    }

    const builtin = builtins[expression.value];
    if (builtin) {
        return builtin;
    }

    return new ErrorObject(`identifier not found: ${expression.value}`);
};

const evaluateExpressions = (expressions: Expression[], environment: Environment): Object[] => {
    const result = [];

    for (let i = 0; i < expressions.length; ++i) {
        const evaluation = evaluate(expressions[i], environment);
        if (isError(evaluation)) {
            return [evaluation];
        }

        result.push(evaluation);
    }

    return result;
};

const evaluateCallExpression = (func: Object, args: Object[]): Object => {
    switch (true) {
    case func instanceof FunctionObject: {
        if (func.parameters.length !== args.length) {
            return new ErrorObject(`wrong arguments amount: received ${args.length}, expected ${func.parameters.length}`)
        }

        const extendedEnvironment = extendFunctionEnvironment(func, args);
        const evaluation = evaluate(func.body, extendedEnvironment);

        return unwrapReturnValue(evaluation);
    }
    case func instanceof BuiltinObject:
        return func.func(...args);
    default:
        return new ErrorObject(`not a function: ${func.type()}`)
    }

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
