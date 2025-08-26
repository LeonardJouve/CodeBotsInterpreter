import type {Expression} from ".";
import type {Token} from "../token";

export default class Identifier implements Expression {
    public token: Token;
	public value: string;

    constructor(token: Token, value: string) {
        this.token = token;
        this.value = value;
    }

    literal(): string {
        return this.token.literal;
    }
};
