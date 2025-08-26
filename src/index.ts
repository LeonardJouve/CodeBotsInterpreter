import Lexer from "./lexer";
import Parser from "./parser";

export default class Interpreter {
    constructor() {}

    repl() {
        const PROMPT = ">> ";

        process.stdout.write(PROMPT);

        process.stdin.setEncoding("utf-8");

        process.stdin.on("data", (line: string) => {
            const lexer = new Lexer(line);
            const parser = new Parser(lexer);
            const program = parser.parseProgram();

            if (parser.errors.length) {
                process.stderr.write("Parser error:\n");

                parser.errors.forEach((error) => {
                    process.stderr.write(`\t${error}\n`);
                });

                process.stdout.write(PROMPT);

                return;
            }

            process.stdout.write(`${program.toString()}\n`);

            process.stdout.write(PROMPT);
        });
    }
}
