import ExpressionStatement from "../ast/expression_statement";
import IntegerExpression from "../ast/integer_expression";
import Program from "../ast/program";
import type {Node, Statement} from "../ast";
import {type Object} from "../object";
import Integer from "../object/integer";
import Null from "../object/null";
import BooleanExpression from "../ast/boolean_expression";
import Boolean from "../object/boolean";
import PrefixExpression from "../ast/prefix_expression";
import InfixExpression from "../ast/infix_expression";

const TRUE = new Boolean(true);
const FALSE = new Boolean(false);
const NULL = new Null();

export const evaluate = (node: Node): Object => {
    switch (true) {
    case node instanceof Program:
        return evaluateStatements(node.statements);
    case node instanceof ExpressionStatement:
        return evaluate(node.expression);
    case node instanceof IntegerExpression:
        return new Integer(node.value);
    case node instanceof BooleanExpression:
        return node.value ? TRUE : FALSE;
    case node instanceof PrefixExpression: {
        const right = evaluate(node.right);
        return evaluatePrefixExpression(node.operator, right);
    }
    case node instanceof InfixExpression: {
        const left = evaluate(node.left);
        const right = evaluate(node.right);
        return evaluateInfixExpression(node.operator, left, right);
    }
    default:
        return NULL;
    }
};

const evaluateStatements = (statements: Statement[]): Object => {
    return statements.reduce((_, statement) => evaluate(statement), NULL);
};

const evaluatePrefixExpression = (operator: string, right: Object): Object => {
    switch (operator) {
    case "!":
        return evaluateBangOperator(right);
    case "-":
        return evaluateMinusOperator(right);
    default:
        return NULL;
    }
};

const evaluateBangOperator = (right: Object): Object => {
    switch (true) {
    case right === FALSE:
    case right === NULL:
    case right instanceof Integer && !right.value:
        return TRUE;
    default:
        return FALSE;
    }
};

const evaluateMinusOperator = (right: Object) => {
    if (!(right instanceof Integer)) {
        return NULL;
    }

    return new Integer(-right.value);
};

const evaluateInfixExpression = (operator: string, left: Object, right: Object): Object => {
    switch (true) {
    case left instanceof Integer && right instanceof Integer:
        return evaluateIntegerInfixExpression(operator, left, right);
    case operator === "==":
        return left === right ? TRUE : FALSE;
    case operator === "!=":
        return left !== right ? TRUE : FALSE;
    default:
        return NULL;
    }
};

const evaluateIntegerInfixExpression = (operator: string, left: Integer, right: Integer): Object => {
    switch (operator) {
    case "+":
        return new Integer(left.value + right.value);
    case "-":
        return new Integer(left.value - right.value);
    case "*":
        return new Integer(left.value * right.value);
    case "/":
        return new Integer(left.value / right.value);
    case "<":
        return left.value < right.value ? TRUE : FALSE;
    case ">":
        return left.value > right.value ? TRUE : FALSE;
    case "==":
        return left.value === right.value ? TRUE : FALSE;
    case "!=":
        return left.value !== right.value ? TRUE : FALSE;
    default:
        return NULL;
    }
};
