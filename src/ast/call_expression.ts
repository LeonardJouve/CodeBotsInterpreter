import type {Expression} from ".";
import type {Token} from "../token";

export default class CallExpression implements Expression {
    public token: Token;
    public func: Expression;
    public args: Expression[];

    constructor(token: Token, func: Expression, args: Expression[]) {
        this.token = token;
        this.func = func;
        this.args = args;
    }

    toString(): string {
        return this.func.toString() + "(" + this.args.map((arg) => arg.toString()).join(", ") + ")";
    }

    literal(): string {
        return this.token.literal;
    }
}
