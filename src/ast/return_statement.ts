import type {Expression, Statement} from ".";
import type {Token} from "../token";

export default class ReturnStatement implements Statement {
    public token: Token;
    public value: Expression;

    constructor(token: Token, value: Expression) {
        this.token = token;
        this.value = value;
    }

    toString(): string {
        return this.literal() + " " + this.value.toString() + ";";
    }

    literal(): string {
        return this.token.literal;
    }
}
