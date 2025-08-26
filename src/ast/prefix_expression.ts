import type {Expression} from ".";
import {Token} from "../token";

export default class PrefixExpression implements Expression {
    public token: Token;
    public operator: string;
    public right: Expression;

    constructor(token: Token, operator: string, right: Expression) {
        this.token = token;
        this.operator = operator;
        this.right = right;
    }

    toString(): string {
        return "(" + this.operator + this.right.toString() + ")";
    }

    literal(): string {
        return this.token.literal;
    }
}
