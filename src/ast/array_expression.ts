import type {Expression} from ".";
import type {Token} from "../token";

export default class ArrayExpression implements Expression {
    public token: Token;
    public elements: Expression[];

    constructor(token: Token, elements: Expression[]) {
        this.token = token;
        this.elements = elements;
    }

    toString(): string {
        return "[" + this.elements.map((element) => element.toString()).join(", ") + "]";
    }

    literal(): string {
        return this.token.literal;
    }
}
