import type {Expression, Statement} from "../ast";
import ExpressionStatement from "../ast/expression_statement";
import IdentifierExpression from "../ast/identifier_expression";
import IntegerExpression from "../ast/integer_expression";
import Program from "../ast/program";
import ReturnStatement from "../ast/return_statement";
import VarStatement from "../ast/var_statement";
import type Lexer from "../lexer";
import {TokenType, type Token} from "../token";

type PrefixParser = () => Expression;
type InfixParser = (expression: Expression) => Expression;

enum OperatorPrecedence {
    LOWEST,
    EQUALS,
    LESSGREATER,
    SUM,
    PRODUCT,
    PREFIX,
    CALL,
};

export default class Parser {
    public lexer: Lexer;
    public currentToken: Token;
    public peekToken: Token;
    public errors: string[];
    public prefixParsers: Partial<Record<TokenType, PrefixParser>>;
	public infixParsers: Partial<Record<TokenType, InfixParser>>;

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
        this.prefixParsers = {
            [TokenType.IDENTIFIER]: this.parseIdentifier.bind(this),
            [TokenType.INT]: this.parseInteger.bind(this),
        };
        this.infixParsers = {};

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
            return this.parseExpressionStatement()
        }
    }

    parseIdentifier(): IdentifierExpression {
        return new IdentifierExpression(this.currentToken, this.currentToken.literal);
    }

    parseInteger(): IntegerExpression {
        const value = Number(this.currentToken.literal);
        if (!Number.isInteger(value)) {
            this.errors.push(`could not parse ${this.currentToken.literal} to an integer`);
        }

        return new IntegerExpression(this.currentToken, value);
    }

    parseExpression(precedence: OperatorPrecedence): Expression|null {
        // defer untrace(trace("parseExpression"))
        const prefix = this.prefixParsers[this.currentToken.type];
        if (!prefix) {
            // this.addInvalidPrefixError(this.currentToken.type);
            return null;
        }

        const left = prefix();

        // for parser.nextTok.Type != token.SEMICOLON && prec < parser.getNextPrecedence() {
        //     infix, ok := parser.infixParsers[parser.nextTok.Type]
        //     if !ok {
        //         return left
        //     }

        //     parser.nextToken()

        //     left = infix(left)
        // }

        return left;
    }

    parseExpressionStatement(): ExpressionStatement|null {
        // defer untrace(trace("parseExpressionStatement"))

        const token = this.currentToken;

        const expression = this.parseExpression(OperatorPrecedence.LOWEST);
        if (!expression) {
            return null;
        }

        if (this.peekToken.type ===  TokenType.SEMICOLON) {
            this.nextToken();
        }

        return new ExpressionStatement(token, expression);
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
