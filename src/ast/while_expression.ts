import type {Expression} from "."
import type {Token} from "../token"
import BlockStatement from "./block_statement";

export default class WhileExpression implements Expression {
    public token: Token;
    public condition: Expression;
    public body: BlockStatement;

    constructor (token: Token, condition: Expression, body: BlockStatement) {
        this.token = token;
        this.condition = condition;
        this.body = body;
    }

    toString(): string {
        return "if " + this.condition.toString() + " " + this.body.toString();
    }

    literal(): string {
        return this.token.literal;
    }


}
