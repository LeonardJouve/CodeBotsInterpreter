import test from "node:test";
import assert from "node:assert";
import Program from "../../src/ast/program";
import VarStatement from "../../src/ast/var_statement";
import IdentifierExpression from "../../src/ast/identifier_expression";
import {TokenType} from "../../src/token";

test("ast", () => {
    const program = new Program();
    const statement = new VarStatement(
        {
            type: TokenType.VAR,
            literal: "var",
        },
        new IdentifierExpression(
            {
                type: TokenType.IDENTIFIER,
                literal: "variable",
            },
            "variable",
        ),
        /* new IdentifierExpression(
            {
                type: TokenType.IDENTIFIER,
                literal: "anotherVariable",
            },
            "anotherVariable",
        ), */
    );

    program.appendStatement(statement);

    const expected = "var variable = ;"; // anotherVariable;";

	assert.equal(program.toString(), expected);
});
