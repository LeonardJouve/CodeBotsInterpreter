import ExpressionStatement from "../ast/expression_statement";
import IntegerExpression from "../ast/integer_expression";
import Program from "../ast/program";
import type {Node, Statement} from "../ast";
import type {Object} from "../object";
import Integer from "../object/integer";
import Null from "../object/null";

export const evaluate = (node: Node): Object => {
    switch (true) {
    case node instanceof Program:
        return evalStatements(node.statements);
    case node instanceof ExpressionStatement:
        return evaluate(node.expression);
    case node instanceof IntegerExpression:
        return new Integer(node.value);
    default:
        // TODO
        return new Null();
    }
};

const evalStatements = (statements: Statement[]): Object => {
    return statements.reduce((_, statement) => evaluate(statement), new Null());
};
