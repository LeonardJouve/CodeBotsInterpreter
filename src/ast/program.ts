import type {Statement} from ".";

export default class Program {
	public statements: Statement[];

    constructor() {
        this.statements = [];
    }

    literal(): string {
        return this.statements[0]?.literal() ?? "";
    }

    appendStatement(statement: Statement) {
        this.statements.push(statement);
    }
}
