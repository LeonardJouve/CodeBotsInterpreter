import type {Expression} from ".";
import type {Token} from "../token";

export default class HashExpression implements Expression {
    public token: Token;
    public pairs: Map<Expression, Expression>;

    constructor(token: Token, pairs: Map<Expression, Expression>) {
        this.token = token;
        this.pairs = pairs;
    }

    toString(): string {
        return "{" + Array.from(this.pairs.entries()).map(([key, value]) => key.toString() + ": " + value.toString()).join(", ") + "}";
    }

    literal(): string {
        return this.token.literal;
    }


}
