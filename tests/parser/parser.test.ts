import assert from "node:assert";
import test from "node:test"
import Lexer from "../../src/lexer";
import Parser from "../../src/parser";
import {Expression, Statement} from "../../src/ast";
import VarStatement from "../../src/ast/var_statement";
import ReturnStatement from "../../src/ast/return_statement";
import ExpressionStatement from "../../src/ast/expression_statement";
import IdentifierExpression from "../../src/ast/identifier_expression";
import IntegerExpression from "../../src/ast/integer_expression";
import PrefixExpression from "../../src/ast/prefix_expression";

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
    t.test("IdentifierExpression should be parsed as expected", () => {
        const input = "foo;";

        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const program = parser.parseProgram();

        testParserErrors(parser);

        assert.equal(program.statements.length, 1);

        const [statement] = program.statements;

        assert.ok(statement instanceof ExpressionStatement);

        // if !testIdentifier(t, expressionStatement.Value, token.TokenLiteral("foo")) {
        //     return
        // }

        const {expression} = statement

        assert.ok(expression instanceof IdentifierExpression);

        assert.equal(expression.value, "foo");

        assert.equal(expression.literal(), "foo");
    })
    t.test("ReturnStatement should be parsed as expected", () => {
        const tests = [
            {
                input:    "return 5;",
                expected: "5",
            },
            {
                input:    "return 10;",
                expected: "10",
            },
            {
                input:    "return x;",
                expected: "x",
            },
            {
                input:    "return x + y;",
                expected: "(x + y)",
            },
        ];

        tests.forEach((test) => {
            const lexer = new Lexer(test.input);
            const parser = new Parser(lexer);
            const program = parser.parseProgram();

            testParserErrors(parser);

            assert.equal(program.statements.length, 1);

            const [statement] = program.statements;

            assert.ok(statement instanceof ReturnStatement);

            assert.equal(statement.literal(), "return");

            // if returnStatement.Value.String() != test.expected {
            //     t.Errorf("[Test] Invalid retrun expression: received %s, expected %s", returnStatement.Value.String(), test.expected)
            // }
        });
    });
    t.test("IntegerExpression should be parsed as expected", () => {
        const input = "5;";

        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const program = parser.parseProgram();

        testParserErrors(parser);

        assert.equal(program.statements.length, 1);

        const [statement] = program.statements;

        assert.ok(statement instanceof ExpressionStatement);

        const {expression} = statement;

        assert.ok(expression instanceof IntegerExpression);

        assert.equal(expression.value, 5);

        assert.equal(expression.literal(), "5");
    });
    t.test("PrefixExpression should be parsed as expected", () => {
        const tests = [
            {
                input:    "!5",
                operator: "!",
                value:    5,
            },
            {
                input:    "-15;",
                operator: "-",
                value:    15,
            },
        ];

        tests.forEach((test) => {
            const lexer = new Lexer(test.input);
            const parser = new Parser(lexer);
            const program = parser.parseProgram();

            testParserErrors(parser);

            assert.equal(program.statements.length, 1);

            const [statement] = program.statements;

            assert.ok(statement instanceof ExpressionStatement);

            const {expression} = statement;

            assert.ok(expression instanceof PrefixExpression);

            assert.equal(expression.operator, test.operator);

            testIntegerExpression(expression.right, test.value);
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

    assert.fail();
}

const testVarStatement = (statement: Statement, name: string, value: any) => {
	assert.equal(statement.literal(), "var");

    assert.ok(statement instanceof VarStatement);

	assert.equal(statement.name.value, name);
	assert.equal(statement.name.literal(), name);

	// if !testLiteralExpression(t, letStatement.Value, value) {
	// 	return false
	// }
};

const testIntegerExpression = (expression: Expression, value: number) => {
    assert.ok(expression instanceof IntegerExpression);

	assert.equal(expression.value, value);

	assert.equal(expression.literal(), String(value));
};
