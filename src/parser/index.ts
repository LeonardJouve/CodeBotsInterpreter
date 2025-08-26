import type {Expression, Statement} from "../ast";
import BlockStatement from "../ast/block_statement";
import BooleanExpression from "../ast/boolean_expression";
import ExpressionStatement from "../ast/expression_statement";
import FunctionExpression from "../ast/function_expression";
import IdentifierExpression from "../ast/identifier_expression";
import IfExpression from "../ast/if_expression";
import InfixExpression from "../ast/infix_expression";
import IntegerExpression from "../ast/integer_expression";
import PrefixExpression from "../ast/prefix_expression";
import Program from "../ast/program";
import ReturnStatement from "../ast/return_statement";
import VarStatement from "../ast/var_statement";
import type Lexer from "../lexer";
import {TokenType, type Token} from "../token";

type PrefixParser = () => Expression|null;
type InfixParser = (expression: Expression) => Expression|null;

enum OperatorPrecedence {
    LOWEST,
    EQUALS,
    LESSGREATER,
    SUM,
    PRODUCT,
    PREFIX,
    CALL,
};

const precedence: Partial<Record<TokenType, OperatorPrecedence>> = {
    [TokenType.EQUAL]: OperatorPrecedence.EQUALS,
    [TokenType.NOT_EQUAL]: OperatorPrecedence.EQUALS,
    [TokenType.LT]: OperatorPrecedence.LESSGREATER,
    [TokenType.GT]: OperatorPrecedence.LESSGREATER,
    [TokenType.PLUS]: OperatorPrecedence.SUM,
    [TokenType.MINUS]: OperatorPrecedence.SUM,
    [TokenType.SLASH]: OperatorPrecedence.PRODUCT,
    [TokenType.ASTERISX]: OperatorPrecedence.PRODUCT,
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
            [TokenType.BANG]: this.parsePrefixExpression.bind(this),
            [TokenType.MINUS]: this.parsePrefixExpression.bind(this),
            [TokenType.TRUE]: this.parseBooleanExpression.bind(this),
            [TokenType.FALSE]: this.parseBooleanExpression.bind(this),
            [TokenType.LPAREN]: this.parseGroupedExpression.bind(this),
            [TokenType.IF]: this.parseIfExpression.bind(this),
            [TokenType.FUNCTION]: this.parseFunctionExpression.bind(this),
        };
        this.infixParsers = {
            [TokenType.EQUAL]: this.parseInfixExpression.bind(this),
            [TokenType.NOT_EQUAL]: this.parseInfixExpression.bind(this),
            [TokenType.LT]: this.parseInfixExpression.bind(this),
            [TokenType.GT]: this.parseInfixExpression.bind(this),
            [TokenType.PLUS]: this.parseInfixExpression.bind(this),
            [TokenType.MINUS]: this.parseInfixExpression.bind(this),
            [TokenType.ASTERISX]: this.parseInfixExpression.bind(this),
            [TokenType.SLASH]: this.parseInfixExpression.bind(this),
            // [TokenType.LPAREN]: this.parseCallExpression.bind(this),
            // [TokenType.LBRACKET]:  this.parseIndexExpression.bind(this),
        };

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
        const prefix = this.prefixParsers[this.currentToken.type];
        if (!prefix) {
            this.addInvalidPrefixError(this.currentToken.type);
            return null;
        }

        let left = prefix();
        if (!left) {
            return null;
        }

        while (this.peekToken.type !== TokenType.SEMICOLON && precedence < this.getPeekPrecedence()) {
            const infix = this.infixParsers[this.peekToken.type];
            if (!infix) {
                return left;
            }

            this.nextToken();

            left = infix(left);
            if (!left) {
                return null;
            }
        }

        return left;
    }

    parseExpressionStatement(): ExpressionStatement|null {
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

        const value = this.parseExpression(OperatorPrecedence.LOWEST);
        if (!value) {
            return null;
        }

        if (this.peekToken.type === TokenType.SEMICOLON) {
            this.nextToken();
        }

        return new ReturnStatement(token, value);
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

        this.nextToken();
        const value = this.parseExpression(OperatorPrecedence.LOWEST);
        if (!value) {
            return null;
        }

        if (this.peekToken.type === TokenType.SEMICOLON) {
            this.nextToken();
        }

        return new VarStatement(token, name, value);
    }

    parsePrefixExpression(): PrefixExpression|null {
        const token = this.currentToken;

        this.nextToken();

        const right = this.parseExpression(OperatorPrecedence.PREFIX);
        if (!right) {
            return null;
        }

        return new PrefixExpression(token, token.literal, right);
    }

    parseInfixExpression(left: Expression): InfixExpression|null {
        const token = this.currentToken;
        const precedence = this.getCurrentPrecedence();

        this.nextToken();

        const right = this.parseExpression(precedence);
        if (!right) {
            return null;
        }

        return new InfixExpression(token, token.literal, left, right);
    }

    parseBooleanExpression(): BooleanExpression {
        return new BooleanExpression(this.currentToken, this.currentToken.type === TokenType.TRUE);
    }

    parseGroupedExpression(): Expression|null {
        this.nextToken();

        const expression = this.parseExpression(OperatorPrecedence.LOWEST);

        if (!this.expectPeekTokenType(TokenType.RPAREN)) {
            return null;
        }

        return expression;
    }

    parseBlockStatement(): BlockStatement {
        const token = this.currentToken;

        this.nextToken();

        const statements = [];
        while (this.currentToken.type !== TokenType.RBRACE && this.currentToken.type !== TokenType.EOF) {
            const statement = this.parseStatement();
            if (statement) {
                statements.push(statement);
            }

            this.nextToken();
        }

        return new BlockStatement(token, statements);
    }

    parseIfExpression(): IfExpression|null {
        const token = this.currentToken;

        if (!this.expectPeekTokenType(TokenType.LPAREN)) {
            return null;
        }

        this.nextToken();

        const condition = this.parseExpression(OperatorPrecedence.LOWEST);
        if (!condition) {
            return null;
        }

        if (!this.expectPeekTokenType(TokenType.RPAREN)) {
            return null;
        }

        if (!this.expectPeekTokenType(TokenType.LBRACE)) {
            return null;
        }

        const consequence = this.parseBlockStatement();

        let alternative;
        if (this.peekToken.type === TokenType.ELSE) {
            this.nextToken();

            if (!this.expectPeekTokenType(TokenType.LBRACE)) {
                return null;
            }

            alternative = this.parseBlockStatement();
        }

        return new IfExpression(token, condition, consequence, alternative);
    }

    parseFunctionParameters(): IdentifierExpression[]|null {
        const parameters: IdentifierExpression[] = [];

        this.nextToken();

        if (this.currentToken.type === TokenType.RPAREN) {
            return parameters;
        }

        parameters.push(new IdentifierExpression(this.currentToken, this.currentToken.literal));

        while (this.peekToken.type === TokenType.COMMA) {
            this.nextToken()
            this.nextToken()
            parameters.push(new IdentifierExpression(this.currentToken, this.currentToken.literal));
        }

        if (!this.expectPeekTokenType(TokenType.RPAREN)) {
            return null;
        }

        return parameters;
    }

    parseFunctionExpression(): FunctionExpression|null {
        const token = this.currentToken;

        if (!this.expectPeekTokenType(TokenType.LPAREN)) {
            return null;
        }

        const parameters = this.parseFunctionParameters();
        if (!parameters) {
            return null;
        }

        if (!this.expectPeekTokenType(TokenType.LBRACE)) {
            return null;
        }

        const body = this.parseBlockStatement();

        return new FunctionExpression(token, parameters, body);
    }

    expectPeekTokenType(tokenType: TokenType): boolean {
        if (this.peekToken.type !== tokenType) {
            this.addInvalidPeekTokenTypeError(this.peekToken, tokenType);
            return false
        }

        this.nextToken();

        return true;
    }

    getPeekPrecedence(): OperatorPrecedence {
        return precedence[this.peekToken.type] ?? OperatorPrecedence.LOWEST;
    }

    getCurrentPrecedence(): OperatorPrecedence {
        return precedence[this.currentToken.type] ?? OperatorPrecedence.LOWEST;
    }

    addInvalidPeekTokenTypeError(received: Token, expected: TokenType) {
        this.errors.push(`invalid peek token type: received ${received}, expected ${expected}`);
    }

    addInvalidPrefixError(tokenType: TokenType) {
        this.errors.push(`no prefix parse function for ${tokenType} found`);
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

        return program;
    }
}
