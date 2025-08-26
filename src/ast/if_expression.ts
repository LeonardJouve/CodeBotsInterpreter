import type {Expression} from ".";
import type {Token} from "../token";
import type BlockStatement from "./block_statement";

export default class IfExpression implements Expression {
    public token: Token;
    public condition: Expression;
    public consequence: BlockStatement;
    public alternative?: BlockStatement;

    constructor(token: Token, condition: Expression, consequence: BlockStatement, alternative?: BlockStatement) {
        this.token = token;
        this.condition = condition;
        this.consequence = consequence;
        this.alternative = alternative;
    }

    toString(): string {
        let s = "if " + this.condition.toString() + " " + this.consequence.toString();

        if (this.alternative) {
            s += "else " + this.alternative.toString();
        }

        return s;
    }

    literal(): string {
        return this.token.literal;
    }
}
