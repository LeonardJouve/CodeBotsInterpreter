Interpreter for the language used by [CodeBots](https://github.com/zaidschouwey98/CodeBots) robots.

Inspired by Thorsten Ball's [book](https://interpreterbook.com)

The interpreter is split into multiple parts:
- [Lexer](https://github.com/LeonardJouve/CodeBotsInterpreter/tree/main/src/lexer)

Instructions to support
```
goto(coordinate)
find(ressource): coordinate
gather()
deposit(item)
take(item)
setCraft(item) // parametrer la workbench
isFull(): boolean
isEmpty(): boolean
wait(time)
hold(item)
has(item): boolean
place(item)

while (condition) {
    if (condition) {
        var a = 0 // boolean, integer, item, ressource, coordinate
    }
}
```
