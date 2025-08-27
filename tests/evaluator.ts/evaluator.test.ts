import test from "node:test";
import assert from "node:assert";
import Lexer from "../../src/lexer";
import Parser from "../../src/parser";
import {evaluate, FALSE, NULL, TRUE} from "../../src/evaluator";
import {Object} from "../../src/object";
import IntegerObject from "../../src/object/integer_object";
import BooleanObject from "../../src/object/boolean_object";
import ErrorObject from "../../src/object/error_object";

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
    t.test("ReturnStatement should evaluate as expected", () => {
        const tests = [
            {
                input:    "return 10;",
                expected: 10,
            },
            {
                input:    "return 10; 9;",
                expected: 10,
            },
            {
                input:    "return 2 * 5; 9;",
                expected: 10,
            },
            {
                input:    "9; return 2 * 5; 9;",
                expected: 10,
            },
            {
                input:    "9; return 2 * 5; return 9;",
                expected: 10,
            },
            {
                input:    "if (true) {if (true) {return 1;} return 2}",
                expected: 1,
            },
            {
                input:    "if (10 > 1) {if (10 > 1) {return 10;}return 1;}",
                expected: 10,
            },
            // {
            //     input:    "var f = fn(x) {return x; x + 10;};f(10);",
            //     expected: 10,
            // },
            // {
            //     input:    "var f = fn(x) {let result = x + 10; return result; return 10;}; f(10);",
            //     expected: 20,
            // },
        ];

        tests.forEach((test) => {
            const evaluation = testEvaluate(test.input);
            testIntegerObject(evaluation, test.expected);
        });
    });
    t.test("evaluate should return ErrorObject as expected", () => {
        const tests = [
            {
                input:    "5 + true;",
                expected: "type mismatch: INTEGER + BOOLEAN",
            },
            {
                input:    "5 + true; 5;",
                expected: "type mismatch: INTEGER + BOOLEAN",
            },
            {
                input:    "-true;",
                expected: "unknown operation: -BOOLEAN",
            },
            {
                input:    "true + false;",
                expected: "unknown operation: BOOLEAN + BOOLEAN",
            },
            {
                input:    "5; true + false; 5;",
                expected: "unknown operation: BOOLEAN + BOOLEAN",
            },
            {
                input:    "if (10 > 1) {return true + false;};",
                expected: "unknown operation: BOOLEAN + BOOLEAN",
            },
            // {
            //     input:    "\"a\" - \"b\";",
            //     expected: "unknown operation: STRING - STRING",
            // },
            {
                input:    "if (10 > 1) {if (10 > 1) {return true + false;} return 10;};",
                expected: "unknown operation: BOOLEAN + BOOLEAN",
            },
            // {
            //     input:    "foo;",
            //     expected: "identifier not found: foo",
            // },
            // {
            //     input:    "{\"name\": \"test\"}[fn(x) {return x;}];",
            //     expected: "object is not hashable: FUNCTION",
            // },
        ];

        tests.forEach((test) => {
            const evaluation = testEvaluate(test.input);
		    testError(evaluation, test.expected);
        });
    })
});

const testEvaluate = (input: string): Object => {
	const lexer = new Lexer(input);
	const parser = new Parser(lexer);
	const program = parser.parseProgram();
	// const env = object.NewEnvironement();

	return evaluate(program/*, env*/);
};

const testIntegerObject = (object: Object, expected: number) => {
	assert.ok(object instanceof IntegerObject);

    assert.equal(object.value, expected);
};

const testBooleanObject = (object: Object, expected: boolean) => {
	assert.ok(object instanceof BooleanObject);

    assert.strictEqual(object, expected ? TRUE : FALSE);
};

const testNullObject = (object: Object) => {
	assert.strictEqual(object, NULL);
};

const testError = (object: Object, expected: string) => {
	assert.ok(object instanceof ErrorObject);

	assert.equal(object.message, expected);
};
