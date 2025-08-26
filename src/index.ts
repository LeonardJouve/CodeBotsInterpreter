import Lexer from "./lexer";

export default class Parser {
    constructor() {
    }

    test(): string {
        return "test";
    }
}

const PROMPT = ">> ";

const repl = () => {
    process.stdout.write(PROMPT);

    process.stdin.setEncoding("utf-8");

    process.stdin.on("data", (line: string) => {
        const lexer = new Lexer(line);

        for (let token = lexer.nextToken(); token.type !== "EOF"; token = lexer.nextToken()) {
            process.stdout.write(JSON.stringify(token) + "\n");
        }

        process.stdout.write(PROMPT);
    });
};

repl();
