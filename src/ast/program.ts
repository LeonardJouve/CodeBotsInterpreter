import type {Statement} from ".";

export default class Program {
	public statements: Statement[];

    constructor() {
        this.statements = [];
    }

    toString(): string {
        return this.statements.reduce((acc, statement) => acc + statement, "")
    }

    literal(): string {
        return this.statements[0]?.literal() ?? "";
    }

    appendStatement(statement: Statement) {
        this.statements.push(statement);
    }
}
