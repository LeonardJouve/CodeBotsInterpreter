import test from "node:test";
import assert from "node:assert";
import {isDigit, isLetter} from "../../src/utils";

test("utils", (t) => {
    t.test("isDigit should return true on digit", () => {
        "0123456789".split("").forEach((digit) => {
            assert.ok(isDigit(digit));
        });
    });
    t.test("isDigit should return false on non-digit", () => {
        "abc*#_$".split("").forEach((digit) => {
            assert.ok(!isDigit(digit));
        });
    });
    t.test("isLetter should return true on letter", () => {
        "abc_".split("").forEach((digit) => {
            assert.ok(isLetter(digit));
        });
    });
    t.test("isLetter should return false on non-letter", () => {
        "0123#".split("").forEach((digit) => {
            assert.ok(!isLetter(digit));
        });
    });
});
