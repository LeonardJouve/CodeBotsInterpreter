import type {Expression} from ".";
import type {Token} from "../token";

export default class BooleanExpression implements Expression {
    public token: Token;
    public value: boolean;

    constructor(token: Token, value: boolean) {
        this.token = token;
        this.value = value;
    }

    toString(): string {
        return this.token.literal;
    }

    literal(): string {
        return this.token.literal;
    }
}
