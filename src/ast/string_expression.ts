import type {Expression} from ".";
import type {Token} from "../token";

export default class StringExpression implements Expression {
    public token: Token;
    public value: string;

    constructor(token: Token, value: string) {
        this.token = token;
        this.value = value;
    }

    toString(): string {
        return this.value;
    }

    literal(): string {
        return this.token.literal;
    }
}
