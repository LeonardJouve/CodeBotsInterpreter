import type {Expression} from ".";
import type {Token} from "../token";
import type BlockStatement from "./block_statement";
import type IdentifierExpression from "./identifier_expression";

export default class FunctionExpression implements Expression {
    public token: Token;
    public parameters: IdentifierExpression[];
    public body: BlockStatement;

    constructor(token: Token, parameters: IdentifierExpression[], body: BlockStatement) {
        this.token = token;
        this.parameters = parameters;
        this.body = body;
    }

    toString(): string {
        return "fn (" + this.parameters.map((parameter) => parameter.toString()).join(", ") + ")" + this.body.toString();
    }

    literal(): string {
        return this.token.literal;
    }
}
