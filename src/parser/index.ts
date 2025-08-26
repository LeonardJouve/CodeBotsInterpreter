import type {Statement} from "../ast";
import IdentifierExpression from "../ast/identifier_expression";
import Program from "../ast/program";
import ReturnStatement from "../ast/return_statement";
import VarStatement from "../ast/var_statement";
import type Lexer from "../lexer";
import {TokenType, type Token} from "../token";

export default class Parser {
    public lexer: Lexer;
    public currentToken: Token;
    public peekToken: Token;
    public errors: string[];

    constructor(lexer: Lexer) {
        this.lexer = lexer;
        this.currentToken = {
            type: TokenType.ILLEGAL,
            literal: "",
        };
        this.peekToken = {
            type: TokenType.ILLEGAL,
            literal: "",
        };
        this.errors = [];

        this.nextToken();
        this.nextToken();
    }

    nextToken() {
        this.currentToken = this.peekToken;
        this.peekToken = this.lexer.nextToken();
    }

    parseStatement(): Statement|null {
        switch (this.currentToken.type) {
        case TokenType.VAR:
            return this.parseVarStatement();
        case TokenType.RETURN:
            return this.parseReturnStatement();
        default:
            return null; // parser.parseExpressionStatement()
        }
    }

    parseReturnStatement(): ReturnStatement|null {
        const token = this.currentToken;

        this.nextToken();

        // const value = parser.parseExpression(LOWEST)

        // if parser.nextTok.Type == token.SEMICOLON {
            // parser.nextToken()
        // }

        while (this.currentToken.type !== TokenType.SEMICOLON) {
            this.nextToken();
        }

        return new ReturnStatement(token/*, value*/);
    }

    parseVarStatement(): VarStatement|null {
        const token = this.currentToken;

        if (!this.expectPeekTokenType(TokenType.IDENTIFIER)) {
            return null;
        }

        const name = new IdentifierExpression(this.currentToken, this.currentToken.literal);

        if (!this.expectPeekTokenType(TokenType.ASSIGN)) {
            return null;
        }

        // this.nextToken();
        // const value = this.parseExpression(LOWEST);

        // if parser.nextTok.Type == token.SEMICOLON {
        //     parser.nextToken()
        // }
        while (this.currentToken.type !== TokenType.SEMICOLON) {
            this.nextToken();
        }

        return new VarStatement(token, name/*, value*/);
    }

    expectPeekTokenType(tokenType: TokenType): boolean {
        if (this.peekToken.type !== tokenType) {
            this.addInvalidPeekTokenTypeError(this.peekToken, tokenType);
            return false
        }

        this.nextToken();

        return true;
    }

    addInvalidPeekTokenTypeError(received: Token, expected: TokenType) {
        this.errors.push(`invalid peek token type: received ${received}, expected ${expected}`);
    }

    parseProgram(): Program {
        const program = new Program();

        while (this.currentToken.type !== TokenType.EOF) {
            const statement = this.parseStatement();
            if (statement) {
                program.appendStatement(statement);
            }

            this.nextToken();
        }

        return program
    }
}
