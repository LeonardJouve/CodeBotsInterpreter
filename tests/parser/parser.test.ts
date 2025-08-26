import assert from "node:assert";
import test from "node:test"
import Lexer from "../../src/lexer";
import Parser from "../../src/parser";
import VarStatement from "../../src/ast/var_statement";
import {Statement} from "../../src/ast";

test("parser", (t) => {
    t.test("VarStatement should be parsed as expected", () => {
        const tests = [
            {
                input:              "var x = 5;",
                expectedIdentifier: "x",
                expectedValue:      5,
            },
            {
                input:              "var y = 10;",
                expectedIdentifier: "y",
                expectedValue:      10,
            },
            {
                input:              "var foo = x;",
                expectedIdentifier: "foo",
                expectedValue:      "x",
            },
        ];

        tests.forEach((test) => {
            const lexer = new Lexer(test.input);
            const parser = new Parser(lexer);
            const program = parser.parseProgram();

            testParserErrors(parser);

            assert.equal(program.statements.length, 1);

            testVarStatement(program.statements[0], test.expectedIdentifier, test.expectedValue);
        });
    });
});

const testParserErrors = (parser: Parser) => {
	const errorAmount = parser.errors.length;
	if (errorAmount === 0) {
		return
	}

	console.error(`parser encountered ${errorAmount} error(s)`)
	parser.errors.forEach((err) => console.error(err));

    assert.equal(errorAmount, 0);
}

const testVarStatement = (statement: Statement, name: string, value: any) => {
	// letType, ok := token.GetKeywordFromType(token.LET)
	// if !ok {
	// 	t.Error("[Test] Invalid token type: received token.LET")
	// 	return false
	// }

	assert.equal(statement.literal(), "var");

    assert.ok(statement instanceof VarStatement);

	assert.equal(statement.name.value, name);
	assert.equal(statement.name.literal(), name);

	// if !testLiteralExpression(t, letStatement.Value, value) {
	// 	return false
	// }
}
