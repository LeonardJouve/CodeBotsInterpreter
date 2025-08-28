import type {Expression} from ".";
import type {Token} from "../token";

export default class IndexExpression implements Expression {
    public token: Token;
    public left: Expression;
    public index: Expression;

    constructor(token: Token, left: Expression, index: Expression) {
        this.token = token;
        this.left = left;
        this.index = index;
    }

    toString(): string {
        return "(" + this.left.toString() + "[" + this.index + "])";
    }

    literal(): string {
        return this.token.literal;
    }
}
