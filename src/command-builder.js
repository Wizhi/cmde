const Command = require("./command");

class CommandBuilder {
    constructor(name, handler) {
        this._name = name;
        this._handler = handler;
        this._arguments = [];
        this._options = [];
    }

    addArgument(name, required = true, defaultValue = undefined, position = undefined) {
        if (!name) {
            throw new Error("Argument must have a name");
        }

        if (this._arguments.some(x => x.name === name)) {
            throw new Error("Argument '" + name + "' is specified");
        }

        const argument = {
            name,
            required: Boolean(required),
            get defaultValue() {
                return typeof defaultValue === "function"
                    ? defaultValue()
                    : defaultValue;
            } 
        };

        if (position !== undefined) {
            this._arguments.splice(Number(position), 0, argument);
        } else {
            this._arguments.push(argument);
        }

        return this;
    }

    removeArgument(name) {
        const index = this._arguments.findIndex(x => x.name === name);

        if (index === -1) {
            return;
        }

        this._arguments.splice(index, 1);
    }

    addOption(long, short, hasValue = false, defaultValue = undefined) {
        if (!long && !short) {
            throw new Error("Options must have a name");
        }

        const isNameTaken = this._options.some(x => x.short === short || x.long === long);

        if (isNameTaken) {
            throw new Error("Option with long name '" + long + "' or short name '" + short + "' is already specified");
        }

        if (short && short.length > 1) {
            throw new Error("Option short name must be only 1 character long");
        }

        this._options.push({ 
            long, 
            short, 
            hasValue: Boolean(hasValue || defaultValue), 
            get defaultValue() {
                return typeof defaultValue === "function"
                    ? defaultValue()
                    : defaultValue;
            } 
        });

        return this;
    }

    removeOption(name) {
        const index = -1;

        if (name.length === 1) {
            index = this._options.findIndex(x => x.short === name);
        } else {
            index = this._options.findIndex(x => x.long === name);
        }

        if (index === -1) {
            return;
        }

        this._options.splice(index, 1);
    }

    build() {
        return new Command(
            this._name, 
            this._arguments.sort(requiredFirst),
            this._options,
            this._handler
        );
    }
}

function requiredFirst(a, b) {
    return a.required == b.required
        ? 0
        : a.required
            ? -1
            : 1
}

module.exports = CommandBuilder;