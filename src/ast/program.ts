import type {Statement} from ".";

export default class Program {
	public statements: Statement[];

    constructor() {
        this.statements = [];
    }

    toString(): string {
        return this.statements.map((statement) => statement.toString()).join("");
    }

    literal(): string {
        return this.statements[0]?.literal() ?? "";
    }

    appendStatement(statement: Statement) {
        this.statements.push(statement);
    }
}
