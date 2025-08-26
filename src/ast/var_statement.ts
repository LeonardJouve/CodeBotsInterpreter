import type {Expression, Statement} from ".";
import type {Token} from "../token";
import type IdentifierExpression from "./identifier_expression";

export default class VarStatement implements Statement {
	public token: Token;
	public name: IdentifierExpression;
	public value: Expression;

    constructor(token: Token, name: IdentifierExpression, value: Expression) {
        this.token = token;
        this.name = name;
        this.value = value;
    }

    toString(): string {
        return this.literal() + " " + this.name.toString() + " = " + this.value.toString() + ";";
    }

    literal(): string {
        return this.token.literal;
    }
}
