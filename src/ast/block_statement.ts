import type {Statement} from ".";
import type {Token} from "../token";

export default class BlockStatement implements Statement {
    public token: Token;
    public statements: Statement[];

    constructor(token: Token, statements: Statement[]) {
        this.token = token;
        this.statements = statements;
    }

    toString(): string {
        return this.statements.map((statement) => statement.toString()).join("");
    }

    literal(): string {
        return this.token.literal;
    }
}
