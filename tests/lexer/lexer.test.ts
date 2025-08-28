import assert from "node:assert";
import test from "node:test";
import Lexer from "../../src/lexer";
import {TokenType, type Token} from "../../src/token";

test("lexer", (t) => {
    t.test("readChar should advance position and char", () => {
        const input = "123";
        const lexer = new Lexer(input);

        input.split("").forEach((char, i) => {
            lexer.readChar();
            assert.equal(char, lexer.char);
            assert.equal(i, lexer.position);
        });
    });
    t.test("peekChar should return expected char and not advance read position", () => {
        const input = "a";

        const lexer = new Lexer(input);

        const char = lexer.peekChar();

        assert.equal(char, input);
        assert.equal(lexer.readPosition, 0);
    });
    t.test("skipWhitepace should skip whitespaces", () => {
        const input = " 0\n1\r2\t3";

        const lexer = new Lexer(input);
        lexer.readChar();

        Array.from({length: 4}).forEach((_, i) => {
            lexer.skipWhitespace();
            assert.equal(String(i), lexer.char);
            lexer.readChar();
        });
    });
    t.test("readIdentifier should return expected literal", () => {
        const input = "test ";

        const lexer = new Lexer(input);
        lexer.readChar();

        const identifier = lexer.readIdentifier();

        assert.equal(identifier, "test");
    });
    t.test("readNumber should return expected literal", () => {
        const input = "123 ";

        const lexer = new Lexer(input);
        lexer.readChar();

        const number = lexer.readNumber();

        assert.equal(number, "123");
    });
    t.test("readString should return expected string", () => {
        const input = `"test"`;

        const lexer = new Lexer(input);
        lexer.readChar();

        const string = lexer.readString();

        assert.equal(string, "test");
    })
    t.test("nextToken should return expected token", () => {
        const input = `
            var five = 5;
            var ten = 10;

            var add = fn(x, y) {
                x + y;
            };

            var result = add(five, ten);

            !-/*5;
            5 < 10 > 5;

            if (5 < 10) {
                return true;
            } else {
                return false;
            }

            10 == 10;
            10 != 9;
            "foo";
            "foo bar";
            [1, 2];
            {"foo": "bar"};
            while (true) {
                5;
            }
        `;

        const tests: Token[] = [
            {type: TokenType.VAR, literal: "var"},
            {type: TokenType.IDENTIFIER, literal: "five"},
            {type: TokenType.ASSIGN, literal: "="},
            {type: TokenType.INT, literal: "5"},
            {type: TokenType.SEMICOLON, literal: ";"},
            {type: TokenType.VAR, literal: "var"},
            {type: TokenType.IDENTIFIER, literal: "ten"},
            {type: TokenType.ASSIGN, literal: "="},
            {type: TokenType.INT, literal: "10"},
            {type: TokenType.SEMICOLON, literal: ";"},
            {type: TokenType.VAR, literal: "var"},
            {type: TokenType.IDENTIFIER, literal: "add"},
            {type: TokenType.ASSIGN, literal: "="},
            {type: TokenType.FUNCTION, literal: "fn"},
            {type: TokenType.LPAREN, literal: "("},
            {type: TokenType.IDENTIFIER, literal: "x"},
            {type: TokenType.COMMA, literal: ","},
            {type: TokenType.IDENTIFIER, literal: "y"},
            {type: TokenType.RPAREN, literal: ")"},
            {type: TokenType.LBRACE, literal: "{"},
            {type: TokenType.IDENTIFIER, literal: "x"},
            {type: TokenType.PLUS, literal: "+"},
            {type: TokenType.IDENTIFIER, literal: "y"},
            {type: TokenType.SEMICOLON, literal: ";"},
            {type: TokenType.RBRACE, literal: "}"},
            {type: TokenType.SEMICOLON, literal: ";"},
            {type: TokenType.VAR, literal: "var"},
            {type: TokenType.IDENTIFIER, literal: "result"},
            {type: TokenType.ASSIGN, literal: "="},
            {type: TokenType.IDENTIFIER, literal: "add"},
            {type: TokenType.LPAREN, literal: "("},
            {type: TokenType.IDENTIFIER, literal: "five"},
            {type: TokenType.COMMA, literal: ","},
            {type: TokenType.IDENTIFIER, literal: "ten"},
            {type: TokenType.RPAREN, literal: ")"},
            {type: TokenType.SEMICOLON, literal: ";"},
            {type: TokenType.BANG, literal: "!"},
            {type: TokenType.MINUS, literal: "-"},
            {type: TokenType.SLASH, literal: "/"},
            {type: TokenType.ASTERISX, literal: "*"},
            {type: TokenType.INT, literal: "5"},
            {type: TokenType.SEMICOLON, literal: ";"},
            {type: TokenType.INT, literal: "5"},
            {type: TokenType.LT, literal: "<"},
            {type: TokenType.INT, literal: "10"},
            {type: TokenType.GT, literal: ">"},
            {type: TokenType.INT, literal: "5"},
            {type: TokenType.SEMICOLON, literal: ";"},
            {type: TokenType.IF, literal: "if"},
            {type: TokenType.LPAREN, literal: "("},
            {type: TokenType.INT, literal: "5"},
            {type: TokenType.LT, literal: "<"},
            {type: TokenType.INT, literal: "10"},
            {type: TokenType.RPAREN, literal: ")"},
            {type: TokenType.LBRACE, literal: "{"},
            {type: TokenType.RETURN, literal: "return"},
            {type: TokenType.TRUE, literal: "true"},
            {type: TokenType.SEMICOLON, literal: ";"},
            {type: TokenType.RBRACE, literal: "}"},
            {type: TokenType.ELSE, literal: "else"},
            {type: TokenType.LBRACE, literal: "{"},
            {type: TokenType.RETURN, literal: "return"},
            {type: TokenType.FALSE, literal: "false"},
            {type: TokenType.SEMICOLON, literal: ";"},
            {type: TokenType.RBRACE, literal: "}"},
            {type: TokenType.INT, literal: "10"},
            {type: TokenType.EQUAL, literal: "=="},
            {type: TokenType.INT, literal: "10"},
            {type: TokenType.SEMICOLON, literal: ";"},
            {type: TokenType.INT, literal: "10"},
            {type: TokenType.NOT_EQUAL, literal: "!="},
            {type: TokenType.INT, literal: "9"},
            {type: TokenType.SEMICOLON, literal: ";"},
            {type: TokenType.STRING, literal: "foo"},
            {type: TokenType.SEMICOLON, literal: ";"},
            {type: TokenType.STRING, literal: "foo bar"},
            {type: TokenType.SEMICOLON, literal: ";"},
            {type: TokenType.LBRACKET, literal: "["},
            {type: TokenType.INT, literal: "1"},
            {type: TokenType.COMMA, literal: ","},
            {type: TokenType.INT, literal: "2"},
            {type: TokenType.RBRACKET, literal: "]"},
            {type: TokenType.SEMICOLON, literal: ";"},
            {type: TokenType.LBRACE, literal: "{"},
            {type: TokenType.STRING, literal: "foo"},
            {type: TokenType.COLON, literal: ":"},
            {type: TokenType.STRING, literal: "bar"},
            {type: TokenType.RBRACE, literal: "}"},
            {type: TokenType.SEMICOLON, literal: ";"},
            {type: TokenType.WHILE, literal: "while"},
            {type: TokenType.LPAREN, literal: "("},
            {type: TokenType.TRUE, literal: "true"},
            {type: TokenType.RPAREN, literal: ")"},
            {type: TokenType.LBRACE, literal: "{"},
            {type: TokenType.INT, literal: "5"},
            {type: TokenType.SEMICOLON, literal: ";"},
            {type: TokenType.RBRACE, literal: "}"},
            {type: TokenType.EOF, literal: "\x00"},
        ];

        const lexer = new Lexer(input);

        tests.forEach((test) => {
            const token = lexer.nextToken();

            assert.deepEqual(token, test);
        });
    });
});
