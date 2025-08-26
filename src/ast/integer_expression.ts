import type {Expression} from ".";
import { Token } from "../token";

export default class IntegerExpression implements Expression {
    public token: Token;
    public value: number;

    constructor(token: Token, value: number) {
        this.token = token;
        this.value = value;
    }

    toString(): string {
        return String(this.value);
    }

    literal(): string {
        return this.token.literal;
    }
}
