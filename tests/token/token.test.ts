import test from "node:test";
import assert from "node:assert";
import {lookupIdentifier, TokenType} from "../../src/token";

test("token", (t) => {
    t.test("lookupIdentifier should return expected identifier", () => {
        const tests = [
            {
                input: "fn",
                expected: TokenType.FUNCTION,
            },
            {
                input: "if",
                expected: TokenType.IF,
            },
            {
                input: "else",
                expected: TokenType.ELSE,
            },
            {
                input: "return",
                expected: TokenType.RETURN,
            },
            {
                input: "let",
                expected: TokenType.LET,
            },
            {
                input: "true",
                expected: TokenType.TRUE,
            },
            {
                input: "false",
                expected: TokenType.FALSE,
            },
        ];

        tests.forEach(({input, expected}) => {
            const tokenType = lookupIdentifier(input);

            assert.equal(tokenType, expected);
        })
    });
});
