const cmdp = require("cmdp");

class Shell {
    constructor() {
        this._commands = new Map();
    }

    addCommand(command) {
        this._commands.set(command.name, command);

        return this;
    }

    removeCommand(command) {
        if (typeof command === 'object') {
            command = command.name;
        }

        this._commands.delete(command);

        return this;
    }

    hasCommand(command) {
        if (typeof command === 'object') {
            command = command.name;
        }

        return this._commands.has(command);
    }

    parse(input) {
        return cmdp.parse(cmdp.lex(input));
    }

    evaluate(input) {
        const info = typeof input === "object"
            ? input
            : this.parse(input);

        if (!this.hasCommand(info.name)) {
            throw new Error("No such command");
        }

        const command = this._commands.get(info.name);

        command.invoke(info.arguments, info.options, this);
    }
}

module.exports = Shell;