import {ObjectType, type Object} from ".";
import BlockStatement from "../ast/block_statement";
import IdentifierExpression from "../ast/identifier_expression";
import Environment from "../environment";

export default class FunctionObject implements Object {
    public parameters: IdentifierExpression[];
    public body: BlockStatement;
    public environment: Environment;

    constructor(parameters: IdentifierExpression[], body: BlockStatement, environment: Environment) {
        this.parameters = parameters;
        this.body = body;
        this.environment = environment;
    }

    type(): ObjectType {
        return ObjectType.FUNCTION;
    }

    inspect(): string {
        return "fn(" + this.parameters.map((parameter) => parameter.toString()).join(", ") + ") {\n" + this.body.toString() + "\n}";
    }
}
