Interpreter for the language used by [CodeBots](https://github.com/zaidschouwey98/CodeBots) robots.

Published to NPM [here](https://www.npmjs.com/package/codebotsinterpreter)

Inspired by Thorsten Ball's [book](https://interpreterbook.com)

The interpreter is split into multiple steps:
- [Lexer](https://github.com/LeonardJouve/CodeBotsInterpreter/tree/main/src/lexer)
- [Parser](https://github.com/LeonardJouve/CodeBotsInterpreter/tree/main/src/parser)
- [Evaluator](https://github.com/LeonardJouve/CodeBotsInterpreter/tree/main/src/evaluator)

Instructions to support
```
goto(coordinate)
find(ressource): coordinate
gather()
deposit(itemType)
take(itemType)
craft(item)
isEmpty(): boolean
wait(time)
hold(item)
has(item): boolean

while (condition) {
    if (condition) {
        var a = 0 // boolean, integer
    }
}
```
