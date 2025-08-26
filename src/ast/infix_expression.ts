import type {Expression} from ".";
import type {Token} from "../token";

export default class InfixExpression implements Expression {
    public token: Token;
    public operator: string;
    public left: Expression;
    public right: Expression;

    constructor(token: Token, operator: string, left: Expression, right: Expression) {
        this.token = token;
        this.operator = operator;
        this.left = left;
        this.right = right;
    }

    toString(): string {
        return "(" + this.left.toString() + " " + this.operator + " " + this.right.toString() + ")";
    }

    literal(): string {
        return this.token.literal;
    }
}
