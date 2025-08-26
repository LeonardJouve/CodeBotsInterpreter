import type {Expression, Statement} from ".";
import type {Token} from "../token";

export default class ExpressionStatement implements Statement {
    public token: Token;
    public expression: Expression;

    constructor(token: Token, expression: Expression) {
        this.token = token;
        this.expression = expression;
    }

    toString(): string {
        return this.expression.toString();
    }

    literal(): string {
        return this.token.literal;
    }

}
