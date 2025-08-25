import {lookupIdentifier, TokenType, type Token} from "../token";
import {isLetter, isDigit} from "../utils";

export default class Lexer {
    private _input: string;
    private _position: number;
    private _readPosition: number;
    private _char: string;

    constructor(input: string) {
        this._input = input;
        this._position = 0;
        this._readPosition = 0;
        this._char = "\x00";
    }

    get input(): string {
        return this._input;
    }

    get char(): string {
        return this._char;
    }

    get readPosition(): number {
        return this._readPosition;
    }

    get position(): number {
        return this._position;
    }

    nextToken(): Token {
        this.readChar();
        this.skipWhitespace();

        const token = {
            type: TokenType.ILLEGAL,
            literal: this.char,
        };

        switch (this.char) {
        case "+":
            token.type = TokenType.PLUS;
            break;
        case "(":
            token.type = TokenType.LPAREN;
            break;
        case ")":
            token.type = TokenType.RPAREN;
            break;
        case "{":
            token.type = TokenType.LBRACE;
            break;
        case "}":
            token.type = TokenType.RBRACE;
            break;
        case ",":
            token.type = TokenType.COMMA;
            break;
        case ";":
            token.type = TokenType.SEMICOLON;
            break;
        case "-":
            token.type = TokenType.MINUS;
            break;
        case "/":
            token.type = TokenType.SLASH;
            break;
        case "*":
            token.type = TokenType.ASTERISX;
            break;
        case "<":
            token.type = TokenType.LR;
            break;
        case ">":
            token.type = TokenType.GR;
            break;
        case "=":
            if  (this.peekChar() === "=") {
                this.readChar();
                token.type = TokenType.EQUAL;
                token.literal += this.char;
            } else {
                token.type = TokenType.ASSIGN;
            }
            break;
        case "!":
            if  (this.peekChar() === "=") {
                this.readChar();
                token.type = TokenType.NOT_EQUAL;
                token.literal += this.char;
            } else {
                token.type = TokenType.BANG;
            }
            break;
        case "\"":
            token.type = TokenType.STRING;
            token.literal = this.readString();
            break;
        case "[":
            token.type = TokenType.LBRACKET;
            break;
        case "]":
            token.type = TokenType.RBRACKET;
            break;
        case ":":
            token.type = TokenType.COLON;
            break;
        case "\x00":
            token.type = TokenType.EOF;
            break;
        default:
            if (isLetter(this.char)) {
                token.literal = this.readIdentifier()
                token.type = lookupIdentifier(token.literal)
            } else if (isDigit(this.char)) {
                token.type = TokenType.INT;
                token.literal = this.readNumber()
            } else {
                token.type = TokenType.ILLEGAL;
            }
            break;
        }

        return token;
    }

    readIdentifier(): string {
        const position = this.position;
        while (isLetter(this.char) && isLetter(this.peekChar())) {
            this.readChar();
        }
        return this.input.slice(position, this.readPosition);
    }

    readNumber(): string {
        const position = this.position;
        while (isDigit(this.char) && isDigit(this.peekChar())) {
            this.readChar();
        }
        return this.input.slice(position, this.readPosition);
    }

    readString(): string {
        const position = this.position + 1;
        while (true) {
            this.readChar();
            if (this.char === "\"" || this.char == "\x00") {
                break;
            }
        }

        return this.input.slice(position, this.position);
    }

    readChar() {
        if (this.readPosition >= this.input.length) {
            this._char = "\x00";
            return;
        }

        this._char = this.input[this.readPosition];
        this._position = this.readPosition;
        this._readPosition += 1;
    }

    peekChar(): string {
        return this.input[this.readPosition];
    }

    skipWhitespace() {
        while (this.char === " " || this.char === "\n" || this.char === "\r" || this.char === "\t") {
            this.readChar();
        }
    }
}
