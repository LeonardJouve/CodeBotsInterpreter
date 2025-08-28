import Lexer from "./lexer";
import Parser from "./parser";
import {evaluate, isError} from "./evaluator";
import Environment from "./environment";
import Builtins from "./evaluator/builtins";
import BuiltinObject from "./object/builtin_object";

export default class Interpreter {
    constructor() {}

    evaluate(code: string, customBuiltins?: Record<string, BuiltinObject>): string|null {
        const lexer = new Lexer(code);
        const parser = new Parser(lexer);
        const program = parser.parseProgram();

        if (parser.errors.length) {
            return "PARSER ERROR: " + parser.errors.join("\n");
        }

        const builtins = new Builtins(customBuiltins);
        const environment = new Environment();

        const evaluation = evaluate(program, environment, builtins);

        if (isError(evaluation)) {
            return evaluation.inspect();
        }

        return null;
    }

    repl() {
        const PROMPT = ">> ";
        const environment = new Environment();

        process.stdout.write(PROMPT);

        process.stdin.setEncoding("utf-8");

        process.stdin.on("data", (line: string) => {
            const lexer = new Lexer(line);
            const parser = new Parser(lexer);
            const program = parser.parseProgram();
            const builtins = new Builtins();

            if (parser.errors.length) {
                process.stderr.write("Parser error:\n");

                parser.errors.forEach((error) => {
                    process.stderr.write(`\t${error}\n`);
                });

                process.stdout.write(PROMPT);

                return;
            }

            const evaluation = evaluate(program, environment, builtins);

            process.stdout.write(`${evaluation.inspect()}\n`);

            process.stdout.write(PROMPT);
        });
    }
}
