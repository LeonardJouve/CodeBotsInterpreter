import type {Expression, Statement} from ".";
import type {Token} from "../token";
import type Identifier from "./identifier";

export default class VarStatement implements Statement {
	public token: Token;
	public name: Identifier;
	// public value: Expression;

    constructor(token: Token, name: Identifier/*, value: Expression*/) {
        this.token = token;
        this.name = name;
        // this.value = value;
    }

    literal(): string {
        return this.token.literal;
    }
}
