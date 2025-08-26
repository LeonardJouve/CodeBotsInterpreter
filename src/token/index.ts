export type Token = {
	type: TokenType;
	literal: string;
};

export enum TokenType {
    ILLEGAL = "ILLEGAL",
	EOF     = "EOF",

	IDENTIFIER = "IDENTIFIER",
	INT        = "INT",
	STRING     = "STRING",

	ASSIGN    = "ASSIGN",
	PLUS      = "PLUS",
	MINUS     = "MINUS",
	BANG      = "BANG",
	ASTERISX  = "ASTERISX",
	SLASH     = "SLASH",
	EQUAL     = "EQUAL",
	NOT_EQUAL = "NOT_EQUAL",

	LT = "LT",
	GT = "GT",

	COMMA     = "COMMA",
	COLON     = "COLON",
	SEMICOLON = "SEMICOLON",

	LPAREN   = "LPAREN",
	RPAREN   = "RPAREN",
	LBRACE   = "LBRACE",
	RBRACE   = "RBRACE",
	LBRACKET = "LBRACKET",
	RBRACKET = "RRACKET",

	FUNCTION = "FUNCTION",
	IF       = "IF",
	ELSE     = "ELSE",
	RETURN   = "RETURN",
	VAR      = "VAR",
	TRUE     = "TRUE",
	FALSE    = "FALSE",
};

const keywords: Record<string, TokenType> = {
	"fn": TokenType.FUNCTION,
	"if": TokenType.IF,
	"else": TokenType.ELSE,
	"return": TokenType.RETURN,
	"var": TokenType.VAR,
	"true": TokenType.TRUE,
	"false": TokenType.FALSE,
};

export const lookupIdentifier = (identifier: string): TokenType => {
    return keywords[identifier] ?? TokenType.IDENTIFIER;
}
