import ExpressionStatement from "../ast/expression_statement";
import IntegerExpression from "../ast/integer_expression";
import Program from "../ast/program";
import type {Node} from "../ast";
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

export const TRUE = new BooleanObject(true);
export const FALSE = new BooleanObject(false);
export const NULL = new NullObject();

export const evaluate = (node: Node): Object => {
    switch (true) {
    case node instanceof Program:
        return evaluateProgram(node);
    case node instanceof ExpressionStatement:
        return evaluate(node.expression);
    case node instanceof IntegerExpression:
        return new IntegerObject(node.value);
    case node instanceof BooleanExpression:
        return node.value ? TRUE : FALSE;
    case node instanceof PrefixExpression: {
        const right = evaluate(node.right);
        if (isError(right)) {
            return right;
        }

        return evaluatePrefixExpression(node.operator, right);
    }
    case node instanceof InfixExpression: {
        const left = evaluate(node.left);
        if (isError(left)) {
            return left;
        }

        const right = evaluate(node.right);
        if (isError(right)) {
            return right;
        }

        return evaluateInfixExpression(node.operator, left, right);
    }
    case node instanceof BlockStatement:
        return evaluateBlockStatement(node);
    case node instanceof IfExpression:
        return evaluateIfExpression(node);
    case node instanceof ReturnStatement: {
        const value = evaluate(node.value);
        if (isError(value)) {
            return value;
        }

        return new ReturnObject(value);
    }
    default:
        return NULL;
    }
};

const isError = (object: Object): boolean => {
    return object.type() === ObjectType.ERROR;
}

const evaluateProgram = (program: Program): Object => {
    let result = NULL;

    for (let i = 0; i < program.statements.length; ++i) {
        result = evaluate(program.statements[i]);

        if (result instanceof ReturnObject) {
            return result.value;
        } else if (result instanceof ErrorObject) {
            return result;
        }
    }

    return result;
};

const evaluateBlockStatement = (blockStatement: BlockStatement): Object => {
    let result = NULL;

    for (let i = 0; i < blockStatement.statements.length; ++i) {
        result = evaluate(blockStatement.statements[i]);

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
        return new ErrorObject(`unknown operator: ${operator}${right.type}`);
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
    case left instanceof IntegerObject && right instanceof IntegerObject:
        return evaluateIntegerInfixExpression(operator, left, right);
    case left.type() !== right.type():
        return new ErrorObject(`type mismatch: ${left.type()} ${operator} ${right.type()}`)
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
        return new ErrorObject(`unknown operator: ${left.type()} ${operator} ${right.type()}`);
    }
};

const evaluateIfExpression = (expression: IfExpression): Object => {
    const condition = evaluate(expression.condition);
    if (isError(condition)) {
        return condition;
    }

    if (isTruthy(condition)) {
        return evaluate(expression.consequence);
    } else if (expression.alternative) {
        return evaluate(expression.alternative);
    } else {
        return NULL;
    }
};
