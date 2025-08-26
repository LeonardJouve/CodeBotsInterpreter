import type {Expression, Statement} from ".";
import type {Token} from "../token";

export default class ReturnStatement implements Statement {
    public token: Token;
    // public value: Expression;

    constructor(token: Token/*, returnValue: Expression*/) {
        this.token = token;
        // this.value = returnValue;
    }

    literal(): string {
        return this.token.literal;
    }
}
