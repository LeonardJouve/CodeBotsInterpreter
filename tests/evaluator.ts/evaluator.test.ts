import test from "node:test";
import assert from "node:assert";
import Lexer from "../../src/lexer";
import Parser from "../../src/parser";
import {evaluate} from "../../src/evaluator";
import {Object} from "../../src/object";
import Integer from "../../src/object/integer";

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
            // {
            //     input:    "-5;",
            //     expected: -5,
            // },
            // {
            //     input:    "-10;",
            //     expected: -10,
            // },
            // {
            //     input:    "5 + 5 + 5 + 5 + 10;",
            //     expected: 30,
            // },
            // {
            //     input:    "2 * 2 * 2 * 2 * 2;",
            //     expected: 32,
            // },
            // {
            //     input:    "-50 + 100 + -50;",
            //     expected: 0,
            // },
            // {
            //     input:    "5 * 2 + 10;",
            //     expected: 20,
            // },
            // {
            //     input:    "5 + 2 * 10;",
            //     expected: 25,
            // },
            // {
            //     input:    "20 + 2 * -10;",
            //     expected: 0,
            // },
            // {
            //     input:    "50 / 2 * 2 + 10;",
            //     expected: 60,
            // },
            // {
            //     input:    "2 * (5 + 10);",
            //     expected: 30,
            // },
            // {
            //     input:    "3 * 3 * 3 + 10;",
            //     expected: 37,
            // },
            // {
            //     input:    "3 * (3 * 3) + 10;",
            //     expected: 37,
            // },
            // {
            //     input:    "(5 + 10 * 2 + 15 / 3) * 2 + -10;",
            //     expected: 50,
            // },
        ];

        tests.forEach((test) => {
            const evaluation = testEval(test.input);
            testIntegerObject(evaluation, test.expected);
        });
    });
});

const testEval = (input: string): Object => {
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
