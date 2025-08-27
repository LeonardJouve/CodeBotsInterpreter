import type {Object} from "../object";

export default class Environment {
    public store: Record<string, Object>;

    constructor() {
        this.store = {};
    }

    get(name: string): Object|null {
        return this.store[name] ?? null;
    }

    set(name: string, value: Object) {
        this.store[name] = value;
    }
}
