import test from "node:test";
import assert from "node:assert";
import Lexer from "../../src/lexer";
import Parser from "../../src/parser";
import {evaluate, NULL} from "../../src/evaluator";
import {Object} from "../../src/object";
import Integer from "../../src/object/integer";
import Boolean from "../../src/object/boolean";

test("evaluator", (t) => {
    t.test("IntegerExpression should evaluate as expected", () => {
        const tests = [
            {
                input:    "5;",
                expected: 5,
            },
            {
                input:    "10;",
                expected: 10,
            },
            {
                input:    "-5;",
                expected: -5,
            },
            {
                input:    "-10;",
                expected: -10,
            },
            {
                input:    "5 + 5 + 5 + 5 + 10;",
                expected: 30,
            },
            {
                input:    "2 * 2 * 2 * 2 * 2;",
                expected: 32,
            },
            {
                input:    "-50 + 100 + -50;",
                expected: 0,
            },
            {
                input:    "5 * 2 + 10;",
                expected: 20,
            },
            {
                input:    "5 + 2 * 10;",
                expected: 25,
            },
            {
                input:    "20 + 2 * -10;",
                expected: 0,
            },
            {
                input:    "50 / 2 * 2 + 10;",
                expected: 60,
            },
            {
                input:    "2 * (5 + 10);",
                expected: 30,
            },
            {
                input:    "3 * 3 * 3 + 10;",
                expected: 37,
            },
            {
                input:    "3 * (3 * 3) + 10;",
                expected: 37,
            },
            {
                input:    "(5 + 10 * 2 + 15 / 3) * 2 + -10;",
                expected: 50,
            },
        ];

        tests.forEach((test) => {
            const evaluation = testEvaluate(test.input);
            testIntegerObject(evaluation, test.expected);
        });
    });
    t.test("BooleanExpression should evaluate as expected", () => {
        const tests = [
            {
                input:    "true;",
                expected: true,
            },
            {
                input:    "false;",
                expected: false,
            },
            {
                input:    "1 < 2;",
                expected: true,
            },
            {
                input:    "1 > 2;",
                expected: false,
            },
            {
                input:    "1 < 1;",
                expected: false,
            },
            {
                input:    "1 > 1;",
                expected: false,
            },
            {
                input:    "1 == 1;",
                expected: true,
            },
            {
                input:    "1 != 1;",
                expected: false,
            },
            {
                input:    "1 == 2;",
                expected: false,
            },
            {
                input:    "1 != 2;",
                expected: true,
            },
            {
                input:    "true == true",
                expected: true,
            },
            {
                input:    "false == false",
                expected: true,
            },
            {
                input:    "true == false",
                expected: false,
            },
            {
                input:    "false == true",
                expected: false,
            },
            {
                input:    "true != true",
                expected: false,
            },
            {
                input:    "false != false",
                expected: false,
            },
            {
                input:    "true != false",
                expected: true,
            },
            {
                input:    "false != true",
                expected: true,
            },
            {
                input:    "1 < 2 == true",
                expected: true,
            },
            {
                input:    "1 < 2 == false",
                expected: false,
            },
            {
                input:    "1 > 2 == false",
                expected: true,
            },
            {
                input:    "1 > 2 == true",
                expected: false,
            },
        ];

        tests.forEach((test) => {
            const evaluation = testEvaluate(test.input);
            testBooleanObject(evaluation, test.expected);
        });
    });
    t.test("bang operator should evaluate as expected", () => {
        const tests = [
        	{
                input:    "!true;",
                expected: false,
            },
            {
                input:    "!false;",
                expected: true,
            },
            {
                input:    "!5;",
                expected: false,
            },
            {
                input:    "!!true;",
                expected: true,
            },
            {
                input:    "!!false;",
                expected: false,
            },
            {
                input:    "!!5;",
                expected: true,
            },
            {
                input:    "!0",
                expected: true,
            },
        ];

        tests.forEach((test) => {
            const evaluation = testEvaluate(test.input);
            testBooleanObject(evaluation, test.expected);
        });
    });
    t.test("IfExpression should evaluate as expected", () => {
        const tests = [
        	{
                input:    "if (true) {10}",
                expected: 10,
            },
            {
                input:    "if (false) {10}",
                expected: null,
            },
            {
                input:    "if (1) {10}",
                expected: 10,
            },
            {
                input:    "if (1 < 2) {10}",
                expected: 10,
            },
            {
                input:    "if (1 > 2) {10}",
                expected: null,
            },
            {
                input:    "if (1 < 2) {10} else {5}",
                expected: 10,
            },
            {
                input:    "if (1 > 2) {10} else {5}",
                expected: 5,
            },
        ];

        tests.forEach((test) => {
            const evaluation = testEvaluate(test.input);
            if (typeof test.expected !== "number") {
                testNullObject(evaluation);

                return;
            }
            testIntegerObject(evaluation, test.expected)
        });
    });
});

const testEvaluate = (input: string): Object => {
	const lexer = new Lexer(input);
	const parser = new Parser(lexer);
	const program = parser.parseProgram();
	// const env = object.NewEnvironement();

	return evaluate(program/*, env*/);
};

const testIntegerObject = (object: Object, expected: number) => {
	assert.ok(object instanceof Integer);

    assert.equal(object.value, expected);
};

const testBooleanObject = (object: Object, expected: boolean) => {
	assert.ok(object instanceof Boolean);

    assert.equal(object.value, expected);
};

const testNullObject = (object: Object) => {
	assert.strictEqual(object, NULL);
};
