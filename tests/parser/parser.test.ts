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
import InfixExpression from "../../src/ast/infix_expression";
import BooleanExpression from "../../src/ast/boolean_expression";
import IfExpression from "../../src/ast/if_expression";
import FunctionExpression from "../../src/ast/function_expression";
import CallExpression from "../../src/ast/call_expression";
import StringExpression from "../../src/ast/string_expression";
import ArrayExpression from "../../src/ast/array_expression";
import IndexExpression from "../../src/ast/index_expression";
import HashExpression from "../../src/ast/hash_expression";
import WhileExpression from "../../src/ast/while_expression";

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

        testIdentifierExpression(statement.expression, "foo");
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

            assert.equal(statement.value.toString(), test.expected);
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

        testIntegerExpression(statement.expression, 5);
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
            {
                input:    "!true",
                operator: "!",
                value:    true,
            },
            {
                input:    "!false",
                operator: "!",
                value:    false,
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

            testLiteralExpression(expression.right, test.value);
        });
    });
    t.test("InfixExpression should be parsed as expected", () => {
        const tests = [
            {
                input:    "5 + 15;",
                operator: "+",
                left:     5,
                right:    15,
            },
            {
                input:    "5 - 15;",
                operator: "-",
                left:     5,
                right:    15,
            },
            {
                input:    "5 * 15;",
                operator: "*",
                left:     5,
                right:    15,
            },
            {
                input:    "5 / 15;",
                operator: "/",
                left:     5,
                right:    15,
            },
            {
                input:    "5 < 15;",
                operator: "<",
                left:     5,
                right:    15,
            },
            {
                input:    "5 > 15;",
                operator: ">",
                left:     5,
                right:    15,
            },
            {
                input:    "5 == 15;",
                operator: "==",
                left:     5,
                right:    15,
            },
            {
                input:    "5 != 15;",
                operator: "!=",
                left:     5,
                right:    15,
            },
            {
                input:    "true == true",
                operator: "==",
                left:     true,
                right:    true,
            },
            {
                input:    "false == false",
                operator: "==",
                left:     false,
                right:    false,
            },
            {
                input:    "true != false",
                operator: "!=",
                left:     true,
                right:    false,
            },
        ];

        tests.forEach((test) => {
            const lexer = new Lexer(test.input);
            const parser = new Parser(lexer);
            const program = parser.parseProgram();

            testParserErrors(parser);

            assert.equal(program.statements.length, 1)

            const [statement] = program.statements;

            assert.ok(statement instanceof ExpressionStatement);

            testInfixExpression(statement.expression, test.operator, test.left, test.right);
        });
    });
    t.test("BooleanExpression should be parsed as expected", () => {
        const input = "true;"

        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const program = parser.parseProgram();

        testParserErrors(parser);

        assert.equal(program.statements.length, 1);
        const [statement] = program.statements;

        assert.ok(statement instanceof ExpressionStatement);

        testBooleanExpression(statement.expression, true);
    });
    t.test("IfExpression should be parsed as expected", () => {
        const tests = [
            {
                input:             "if (x < y) { x }",
                conditionOperator: "<",
                conditionLeft:     "x",
                conditionRight:    "y",
                consequence:       "x",
                alternative:       "",
            },
            {
                input:             "if (y > x) { y } else { x }",
                conditionOperator: ">",
                conditionLeft:     "y",
                conditionRight:    "x",
                consequence:       "y",
                alternative:       "x",
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

            testIfExpression(statement.expression, test.conditionOperator, test.conditionLeft, test.conditionRight, test.consequence, test.alternative);
        });
    });
    t.test("WhileExpression should be parsed as expected", () => {
        const tests = [
            {
                input:             "while (i < j) { i }",
                conditionOperator: "<",
                conditionLeft:     "i",
                conditionRight:    "j",
                consequence:       "i",
            },
            {
                input:             "while (true) { i }",
                condition:         true,
                consequence:       "i",
            },
        ];

        tests.forEach((test) => {
            const lexer = new Lexer(test.input);
            const parser = new Parser(lexer);
            const program = parser.parseProgram();

            testParserErrors(parser);

            assert.equal(program.statements.length, 1);

            let [statement] = program.statements;

            assert.ok(statement instanceof ExpressionStatement);

            const {expression} = statement;

            assert.ok(expression instanceof WhileExpression);

            const {body, condition} = expression;

            if (test.condition) {
                testBooleanExpression(condition, test.condition);
            } else if (test.conditionOperator && test.conditionLeft && test.conditionRight) {
                testInfixExpression(condition, test.conditionOperator, test.conditionLeft, test.conditionRight);
            }

            assert.equal(body.statements.length, 1);

            [statement] = body.statements;

            assert.ok(statement instanceof ExpressionStatement);

            testIdentifierExpression(statement.expression, test.consequence);
        });
    });
    t.test("FunctionExpression should be parsed as expected", () => {
        const input = "fn (x, y) { x + y; }";

        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const program = parser.parseProgram();

        testParserErrors(parser);

        assert.equal(program.statements.length, 1);

        let [statement] = program.statements;

        assert.ok(statement instanceof ExpressionStatement);

        const {expression} = statement;

        assert.ok(expression instanceof FunctionExpression);

        assert.equal(expression.parameters.length, 2);

        testLiteralExpression(expression.parameters[0], "x")
        testLiteralExpression(expression.parameters[1], "y")

        const {body} = expression;

        assert.equal(body.statements.length, 1);

        [statement] = body.statements;

        assert.ok(statement instanceof ExpressionStatement);

        testInfixExpression(statement.expression, "+", "x", "y");
    });
    t.test("CallExpression should be parsed as expected", () => {
        const input = "add(1, 2 + 3, 4 * 5);";

        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const program = parser.parseProgram();

        testParserErrors(parser);

        assert.equal(program.statements.length, 1);

        const [statement] = program.statements;

        assert.ok(statement instanceof ExpressionStatement);

        const {expression} = statement;

        assert.ok(expression instanceof CallExpression);

        testIdentifierExpression(expression.func, "add");

        assert.equal(expression.args.length, 3);

        testLiteralExpression(expression.args[0], 1);
        testInfixExpression(expression.args[1], "+", 2, 3);
        testInfixExpression(expression.args[2], "*", 4, 5);
    });
    t.test("StringExpression should be parsed as expected", () => {
        const input = "\"hello world\";";

        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const program = parser.parseProgram();

        testParserErrors(parser);

        assert.equal(program.statements.length, 1);

        const [statement] = program.statements;

        assert.ok(statement instanceof ExpressionStatement);

        const {expression} = statement;

        assert.ok(expression instanceof StringExpression);

        assert.equal(expression.value, "hello world");
    });
    t.test("should parse function parameters as expected", () => {
        const tests = [
            {
                input:    "fn () {}",
                expected: [],
            },
            {
                input: "fn (x) {}",
                expected: ["x"],
            },
            {
                input: "fn (x, y) {}",
                expected: [
                    "x",
                    "y",
                ],
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

            assert.ok(expression instanceof FunctionExpression);

            assert.equal(expression.parameters.length, test.expected.length);

            test.expected.forEach((expectedParameter, i) => {
                testLiteralExpression(expression.parameters[i], expectedParameter);
            });
        });
    });
    t.test("should parse with expected operator precedence", () => {
        const tests = [
            {
                input:    "-a * b",
                expected: "((-a) * b)",
            },
            {
                input:    "!-a",
                expected: "(!(-a))",
            },
            {
                input:    "a + b + c",
                expected: "((a + b) + c)",
            },
            {
                input:    "a + b - c",
                expected: "((a + b) - c)",
            },
            {
                input:    "a * b * c",
                expected: "((a * b) * c)",
            },
            {
                input:    "a * b / c",
                expected: "((a * b) / c)",
            },
            {
                input:    "a + b / c",
                expected: "(a + (b / c))",
            },
            {
                input:    "a + b * c + d / e - f",
                expected: "(((a + (b * c)) + (d / e)) - f)",
            },
            {
                input:    "3 + 4; -5 * 5",
                expected: "(3 + 4)((-5) * 5)",
            },
            {
                input:    "5 > 4 == 3 < 4",
                expected: "((5 > 4) == (3 < 4))",
            },
            {
                input:    "5 > 4 != 3 < 4",
                expected: "((5 > 4) != (3 < 4))",
            },
            {
                input:    "3 + 4 * 5 == 3 * 1 + 4 * 5",
                expected: "((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))",
            },
            {
                input:    "true",
                expected: "true",
            },
            {
                input:    "false",
                expected: "false",
            },
            {
                input:    "3 > 5 == false",
                expected: "((3 > 5) == false)",
            },
            {
                input:    "3 < 5 == true",
                expected: "((3 < 5) == true)",
            },
            {
                input:    "1 + (2 + 3) + 4",
                expected: "((1 + (2 + 3)) + 4)",
            },
            {
                input:    "(5 + 5) * 2",
                expected: "((5 + 5) * 2)",
            },
            {
                input:    "2 / (5 + 5)",
                expected: "(2 / (5 + 5))",
            },
            {
                input:    "-(5 + 5)",
                expected: "(-(5 + 5))",
            },
            {
                input:    "!(true == true)",
                expected: "(!(true == true))",
            },
            {
                input:    "a + add(b * c) + d",
                expected: "((a + add((b * c))) + d)",
            },
            {
                input:    "add(a, b, 1, 2 * 3, 4 + 5, add(6, 7 * 8))",
                expected: "add(a, b, 1, (2 * 3), (4 + 5), add(6, (7 * 8)))",
            },
            {
                input:    "add(a + b + c * d / f + g)",
                expected: "add((((a + b) + ((c * d) / f)) + g))",
            },
            {
                input:    "a * [1, 2, 3, 4][b * c] * d",
                expected: "((a * ([1, 2, 3, 4][(b * c)])) * d)",
            },
            {
                input:    "add(a * b[2], b[1], 2 * [1, 2][1])",
                expected: "add((a * (b[2])), (b[1]), (2 * ([1, 2][1])))",
            },
        ];

        tests.forEach((test) => {
            const lexer = new Lexer(test.input);
            const parser = new Parser(lexer);
            const program = parser.parseProgram();

            testParserErrors(parser);

            assert.equal(program.toString(), test.expected);
        });
    });
    t.test("ArrayExpression should be parsed as expected", () => {
        const input = "[1, 2 * 2, 3 + 3]";

        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const program = parser.parseProgram();

        testParserErrors(parser);

        assert.equal(program.statements.length, 1);

        const [statement] = program.statements;

        assert.ok(statement instanceof ExpressionStatement);

        const {expression} = statement;

        assert.ok(expression instanceof ArrayExpression);

        assert.equal(expression.elements.length, 3);

        testIntegerExpression(expression.elements[0], 1);
        testInfixExpression(expression.elements[1], "*", 2, 2);
        testInfixExpression(expression.elements[2], "+", 3, 3);
    });
    t.test("IndexExpression should be parsed as expected", () => {
        const input = "array[1 + 1]";

        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const program = parser.parseProgram();

        testParserErrors(parser);

        assert.equal(program.statements.length, 1);

        const [statement] = program.statements;

        assert.ok(statement instanceof ExpressionStatement);

        const {expression} = statement;

        assert.ok(expression instanceof IndexExpression);

        testIdentifierExpression(expression.left, "array");
        testInfixExpression(expression.index, "+", 1, 1);
    });
    t.test("HashExpression with string keys should be parsed as expected", () => {
        const input = "{\"one\": 1, \"two\": 2, \"three\": 3};";
        const expected = {
            "one": 1,
            "two": 2,
            "three": 3,
        };

        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const program = parser.parseProgram();

        testParserErrors(parser);

        assert.equal(program.statements.length, 1);

        const [statement] = program.statements;

        assert.ok(statement instanceof ExpressionStatement);

        const {expression} = statement;

        assert.ok(expression instanceof HashExpression);

        const pairs = Array.from(expression.pairs.entries());

        assert.equal(pairs.length, Object.keys(expected).length);

        Object.entries(expected).forEach(([key, value], i) => {
            const pair = pairs[i];

            assert.ok(pair[0] instanceof StringExpression);

            assert.equal(pair[0].value, key);

            testIntegerExpression(pair[1], value);
        });
    });
    t.test("empty HashExpression should be parsed as expected", () => {
        const input = "{};";

        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const program = parser.parseProgram();

        testParserErrors(parser);

        assert.equal(program.statements.length, 1);

        const [statement] = program.statements;

        assert.ok(statement instanceof ExpressionStatement);

        const {expression} = statement;

        assert.ok(expression instanceof HashExpression);

        assert.equal(expression.pairs.size, 0);
    });
    t.test("HashExpression with expressions should be parsed as expected", () => {
        const input = "{\"one\": 0 + 1, \"two\": 10 - 8, \"three\": 15 / 5};";

        const expected = {
            "one": (expression: Expression) => testInfixExpression(expression, "+", 0, 1),
            "two": (expression: Expression) => testInfixExpression(expression, "-", 10, 8),
            "three": (expression: Expression) => testInfixExpression(expression, "/", 15, 5),
        };

        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const program = parser.parseProgram();

        testParserErrors(parser);

        assert.equal(program.statements.length, 1);

        const [statement] = program.statements;

        assert.ok(statement instanceof ExpressionStatement);

        const {expression} = statement;

        assert.ok(expression instanceof HashExpression);

        const pairs = Array.from(expression.pairs.entries());

        assert.equal(pairs.length, Object.keys(expected).length);

        Object.entries(expected).forEach(([key, test], i) => {
            const pair = pairs[i];

            assert.ok(pair[0] instanceof StringExpression);

            assert.equal(pair[0].value, key);

            test(pair[1]);
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
};

const testVarStatement = (statement: Statement, name: string, value: number | string | boolean) => {
	assert.equal(statement.literal(), "var");

    assert.ok(statement instanceof VarStatement);

    testIdentifierExpression(statement.name, name);

	testLiteralExpression(statement.value, value);
};

const testIntegerExpression = (expression: Expression, value: number) => {
    assert.ok(expression instanceof IntegerExpression);

	assert.equal(expression.value, value);

	assert.equal(expression.literal(), String(value));
};

const testLiteralExpression = (expression: Expression, expected: number | string | boolean) => {
    switch (typeof expected) {
	case "number":
		return testIntegerExpression(expression, expected);
	case "string":
		return testIdentifierExpression(expression, expected);
	case "boolean":
		return testBooleanExpression(expression, expected);
	default:
        assert.fail("unsupported expected result type");
	}
};

const testInfixExpression = (expression: Expression, operator: string, left: number | string | boolean, right: number | string | boolean) => {
    assert.ok(expression instanceof InfixExpression);

	assert.equal(expression.operator, operator);

	testLiteralExpression(expression.left, left);
	testLiteralExpression(expression.right, right);
};

const testIdentifierExpression = (expression: Expression, value: string) => {
    assert.ok(expression instanceof IdentifierExpression);

    assert.equal(expression.value, value);

    assert.equal(expression.literal(), value);
};

const testBooleanExpression = (expression: Expression, value: boolean) => {
    assert.ok(expression instanceof BooleanExpression);

    assert.equal(expression.value, value);

    assert.equal(expression.literal(), String(value));
}

const testIfExpression = (expression: Expression, expectedConditionOperator: string, expectedConditionLeft: string, expectedConditionRight: string, expectedConsequence: string, expectedAlternative?: string) => {
	assert.ok(expression instanceof IfExpression);

	testInfixExpression(expression.condition, expectedConditionOperator, expectedConditionLeft, expectedConditionRight);

    const {consequence, alternative} = expression;
    assert.equal(consequence.statements.length, 1);

    let [statement] = consequence.statements;

    assert.ok(statement instanceof ExpressionStatement);

	testIdentifierExpression(statement.expression, expectedConsequence);

	if (expectedAlternative) {
        assert.ok(alternative);
        assert.equal(alternative.statements.length, 1);

        [statement] = alternative.statements;

        assert.ok(statement instanceof ExpressionStatement);

		testIdentifierExpression(statement.expression, expectedAlternative);
	} else {
        assert.ok(!alternative);
    }
}
