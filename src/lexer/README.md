The lexer transforms code into an array of tokens.

For example, `var test = 0` transforms into

```
[
    VAR,
    IDENTIFIER("test"),
    EQUAL,
    INTEGER(0),
]
```
