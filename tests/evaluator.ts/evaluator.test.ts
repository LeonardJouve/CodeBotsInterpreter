import test from "node:test";
import assert from "node:assert";
import Lexer from "../../src/lexer";
import Parser from "../../src/parser";
import {evaluate, FALSE, NULL, TRUE} from "../../src/evaluator";
import {Object} from "../../src/object";
import IntegerObject from "../../src/object/integer_object";
import BooleanObject from "../../src/object/boolean_object";
import ErrorObject from "../../src/object/error_object";
import FunctionObject from "../../src/object/function_object";
import StringObject from "../../src/object/string_object";
import ArrayObject from "../../src/object/array_object";
import HashObject from "../../src/object/hash_object";
import Environment from "../../src/environment";
import type {HashKey} from "../../src/object/hash_key";
import Builtins from "../../src/evaluator/builtins";

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
    t.test("WhileExpression should be evaluated as expected", () => {
        const tests = [
            {
                input: "var i = 0; while (i < 3) { var i = i + 1; } i;",
                expected: 3,
            },
            {
                input: "var i = 0; while (i < 0) { var i = i + 1; } i;",
                expected: 0,
            },
            {
                input: "var i = 0; var sum = 0; while (i < 5) { var sum = sum + i; var i = i + 1; } sum;",
                expected: 10,
            },
            {
                input: "while (false) { 99 }",
                expected: null,
            },
        ];

        tests.forEach((test) => {
            const evaluation = testEvaluate(test.input);

            if (test.expected === null) {
                testNullObject(evaluation);
                return;
            }

            testIntegerObject(evaluation, test.expected);
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
            {
                input:    "var f = fn(x) {return x; x + 10;};f(10);",
                expected: 10,
            },
            {
                input:    "var f = fn(x) {var result = x + 10; return result; return 10;}; f(10);",
                expected: 20,
            },
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
            {
                input:    "\"a\" - \"b\";",
                expected: "unknown operation: STRING - STRING",
            },
            {
                input:    "if (10 > 1) {if (10 > 1) {return true + false;} return 10;};",
                expected: "unknown operation: BOOLEAN + BOOLEAN",
            },
            {
                input:    "foo;",
                expected: "identifier not found: foo",
            },
            {
                input:    "{\"name\": \"test\"}[fn(x) {return x;}];",
                expected: "unusable as hash key: FUNCTION",
            },
        ];

        tests.forEach((test) => {
            const evaluation = testEvaluate(test.input);
		    testError(evaluation, test.expected);
        });
    });
    t.test("VarStatement should be parsed as expected", () => {
        const tests = [
            {
                input:    "var x = 5; x;",
                expected: 5,
            },
            {
                input:    "var x = 5 * 5; x;",
                expected: 25,
            },
            {
                input:    "var x = 5; var y = x; y;",
                expected: 5,
            },
            {
                input:    "var x = 5; var y = x; var z = x + y + 5; z;",
                expected: 15,
            },
        ];

        tests.forEach((test) => {
            const evaluation = testEvaluate(test.input);
            testIntegerObject(evaluation, test.expected);
        });
    });
    t.test("FunctionExpression should be evaluated as expected", () => {
        const input = "fn(x) {return x + 2;}";
        const evaluation = testEvaluate(input);

        assert.ok(evaluation instanceof FunctionObject);

        assert.equal(evaluation.parameters.length, 1);

        const [parameter] = evaluation.parameters;
        assert.equal(parameter.toString(), "x");

        assert.equal(evaluation.body.toString(), "return (x + 2);");
    });
    t.test("CallExpression should be evaluated as expected", () => {
        const tests = [
            {
                input:    "var identify = fn(x) {x;}; identify(5);",
                expected: 5,
            },
            {
                input:    "var identify = fn(x) {return x;}; identify(5);",
                expected: 5,
            },
            {
                input:    "var double = fn(x) {x * 2;}; double(5);",
                expected: 10,
            },
            {
                input:    "var double = fn(x) {return x * 2;}; double(5);",
                expected: 10,
            },
            {
                input:    "var add = fn(x, y) {x + y;}; add(5, 5);",
                expected: 10,
            },
            {
                input:    "var add = fn(x, y) {x + y;}; add(5 + 5, add(5, 5));",
                expected: 20,
            },
            {
                input:    "fn(x) {x;}(5);",
                expected: 5,
            },
        ];

        tests.forEach((test) => {
            const evaluation = testEvaluate(test.input);
            testIntegerObject(evaluation, test.expected);
        });
    });
    t.test("StringExpression should be evaluated as expected", () => {
        const input = "\"hello world\"";

        const evaluation = testEvaluate(input);

        assert.ok(evaluation instanceof StringObject);

        assert.equal(evaluation.value, "hello world");
    });
    t.test("StringExpression should concatenate as expected", () => {
        const input = "\"hello\" + \" \" + \"world\"";

        const evaluation = testEvaluate(input);

        assert.ok(evaluation instanceof StringObject);

        assert.equal(evaluation.value, "hello world");
    });
    t.test("closures should be evaluated as expected", () => {
        const input = "var newAdder = fn(x) {return fn(y) {return x + y;};}; var x = 10; var y = 10; var addTwo = newAdder(2); addTwo(2);";

        const evaluation = testEvaluate(input);
        testIntegerObject(evaluation, 4);
    });
    t.test("builtin functions should be evaluated as expected", () => {
        const tests = [
            {
                input:    "len(\"\")",
                expected: 0,
            },
            {
                input:    "len(\"four\")",
                expected: 4,
            },
            {
                input:    "len(\"hello world\")",
                expected: 11,
            },
            {
                input:    "len(1)",
                expected: "unsupported argument type for builtin function len: INTEGER",
            },
            {
                input:    "len(\"one\", \"two\")",
                expected: "wrong arguments amount: received 2, expected 1",
            },
            {
                input:    "len([1, 2, 3])",
                expected: 3,
            },
            {
                input:    "len([])",
                expected: 0,
            },
            {
                input:    "first([1, 2, 3])",
                expected: 1,
            },
            {
                input:    "first([])",
                expected: null,
            },
            {
                input:    "first(1)",
                expected: "unsupported argument type for builtin function first: INTEGER",
            },
            {
                input:    "last([1, 2, 3])",
                expected: 3,
            },
            {
                input:    "last([])",
                expected: null,
            },
            {
                input:    "last(1)",
                expected: "unsupported argument type for builtin function last: INTEGER",
            },
            {
                input:    "rest([1, 2, 3])",
                expected: [2, 3],
            },
            {
                input:    "rest([])",
                expected: null,
            },
            {
                input:    "push([], 1)",
                expected: [1],
            },
            {
                input:    "push(1, 1)",
                expected: "unsupported argument type for builtin function push: INTEGER",
            },
        ];

        tests.forEach((test) => {
            const evaluation = testEvaluate(test.input);

            switch (true) {
            case typeof test.expected === "number":
                testIntegerObject(evaluation, test.expected);
                break;
            case typeof test.expected === "string":
                testError(evaluation, test.expected);
                break;
            case test.expected === null:
                testNullObject(evaluation);
                break;
            case typeof test.expected === "object":
                assert.ok(evaluation instanceof ArrayObject);
                assert.equal(evaluation.elements.length, test.expected.length);
                test.expected.forEach((element, i) => {
                    testIntegerObject(evaluation.elements[i], element);
                });
                break;
            }
        });
    });
    t.test("ArrayExpression should be evaluated as expected", () => {
        const input = "[1, 2 * 2, 3 + 3]";

        const evaluation = testEvaluate(input);

        assert.ok(evaluation instanceof ArrayObject);

        assert.equal(evaluation.elements.length, 3);

        testIntegerObject(evaluation.elements[0], 1);
        testIntegerObject(evaluation.elements[1], 4);
        testIntegerObject(evaluation.elements[2], 6);
    });
    t.test("IndexExpression should be evaluated as expected", () => {
        const tests = [
            {
                input:    "[1, 2, 3][0];",
                expected: 1,
            },
            {
                input:    "[1, 2, 3][1];",
                expected: 2,
            },
            {
                input:    "[1, 2, 3][2];",
                expected: 3,
            },
            {
                input:    "var x = 0; [1][x];",
                expected: 1,
            },
            {
                input:    "[1, 2, 3][1 + 1];",
                expected: 3,
            },
            {
                input:    "var x = [1, 2, 3]; x[2];",
                expected: 3,
            },
            {
                input:    "var x = [1, 2, 3]; x[0] + x[1] + x[2];",
                expected: 6,
            },
            {
                input:    "var x = [1, 2, 3]; var y = x[0]; x[y];",
                expected: 2,
            },
            {
                input:    "[1, 2, 3][3];",
                expected: null,
            },
            {
                input:    "[1, 2, 3][-1];",
                expected: null,
            },
        ];

        tests.forEach((test) => {
            const evaluation = testEvaluate(test.input);

            if (test.expected === null) {
                testNullObject(evaluation);
                return;
            }

            testIntegerObject(evaluation, test.expected);
        });
    });
    t.test("HashExpression should be evaluated as expected", () => {
        const input = "var two = \"two\"; {\"one\": 10 - 9, two: 1 + 1, \"thr\" + \"ee\": 6 / 2, 4: 4, true: 5, false: 6};";
        const expected = new Map<HashKey, number>([
            [new StringObject("one").hashKey(), 1],
            [new StringObject("two").hashKey(), 2],
            [new StringObject("three").hashKey(), 3],
            [new IntegerObject(4).hashKey(), 4],
            [TRUE.hashKey(), 5],
            [FALSE.hashKey(), 6],
        ]);

        const evaluation = testEvaluate(input);

        assert.ok(evaluation instanceof HashObject);

        assert.equal(evaluation.pairs.size, expected.size);

        expected.forEach((expectedValue, expectedHash) => {
            const element = evaluation.pairs.get(expectedHash.toString());

            assert.ok(element);

            testIntegerObject(element.value, expectedValue);
        });
    });
    t.test("hash IndexExpression should be evaluated as expected", () => {
        const tests = [
            {
                input:    "{\"foo\": 5}[\"foo\"];",
                expected: 5,
            },
            {
                input:    "{\"foo\": 5}[\"bar\"];",
                expected: null,
            },
            {
                input:    "var key = \"foo\"; {\"foo\": 5}[key];",
                expected: 5,
            },
            {
                input:    "{}[\"foo\"]",
                expected: null,
            },
            {
                input:    "{10: 5}[10]",
                expected: 5,
            },
            {
                input:    "{true: 5}[true]",
                expected: 5,
            },
            {
                input:    "{false: 5}[false]",
                expected: 5,
            },
        ];

        tests.forEach((test) => {
            const evaluation = testEvaluate(test.input);

            if (test.expected === null) {
                testNullObject(evaluation);
                return;
            }

            testIntegerObject(evaluation, test.expected);
        });
    });
});

const testEvaluate = (input: string): Object => {
	const lexer = new Lexer(input);
	const parser = new Parser(lexer);
	const program = parser.parseProgram();
	const environment = new Environment();
    const builtins = new Builtins();

	return evaluate(program, environment, builtins);
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
