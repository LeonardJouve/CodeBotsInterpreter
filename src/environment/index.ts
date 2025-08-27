import type {Object} from "../object";

export default class Environment {
    public store: Record<string, Object>;
    public outer?: Environment;

    constructor(outer?: Environment) {
        this.store = {};
        this.outer = outer;
    }

    get(name: string): Object|null {
        return this.store[name] ?? this.outer?.get(name) ?? null;
    }

    set(name: string, value: Object) {
        this.store[name] = value;
    }
}
