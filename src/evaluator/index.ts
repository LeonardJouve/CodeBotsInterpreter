import ExpressionStatement from "../ast/expression_statement";
import IntegerExpression from "../ast/integer_expression";
import Program from "../ast/program";
import type {Node, Statement} from "../ast";
import type {Object} from "../object";
import Integer from "../object/integer";
import Null from "../object/null";
import BooleanExpression from "../ast/boolean_expression";
import Boolean from "../object/boolean";

const TRUE = new Boolean(true);
const FALSE = new Boolean(false);
const NULL = new Null();

export const evaluate = (node: Node): Object => {
    switch (true) {
    case node instanceof Program:
        return evalStatements(node.statements);
    case node instanceof ExpressionStatement:
        return evaluate(node.expression);
    case node instanceof IntegerExpression:
        return new Integer(node.value);
    case node instanceof BooleanExpression:
        return node.value ? TRUE : FALSE;
    default:
        // TODO
        return NULL;
    }
};

const evalStatements = (statements: Statement[]): Object => {
    return statements.reduce((_, statement) => evaluate(statement), NULL);
};
