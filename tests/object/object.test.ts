import test from "node:test";
import StringObject from "../../src/object/string_object";
import assert from "node:assert";

test("object", (t) => {
    t.test("string hash key", () => {
        const tests = [
            {
                objects: [
                    new StringObject("hello world"),
                    new StringObject("hello world"),
                ],
                expected: true,
            },
            {
                objects: [
                    new StringObject("test test test"),
                    new StringObject("test test test"),
                ],
                expected: true,
            },
            {
                objects: [
                    new StringObject("hello world"),
                    new StringObject("test test test"),
                ],
                expected: false,
            },
        ];

        tests.forEach((test) => {
            if (test.expected) {
                assert.deepEqual(test.objects[0].hashKey(), test.objects[1].hashKey());
            } else {
                assert.notDeepEqual(test.objects[0].hashKey(), test.objects[1].hashKey());
            }
        });
    });
});
