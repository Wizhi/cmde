class Command {
    constructor(name, args, options, handler) {
        if (!name) {
            throw new TypeErrorConstructor("Command name must be specified");
        }

        if (typeof handler !== "function") {
            throw new TypeErrorConstructor("Command handler must be a function");
        }

        this.name = name;
        this.handler = handler;
        this.arguments = args || [];
        this.options = options || [];
        this._optionsMap = new Map();

        options.forEach(option => {
            if (option.short) {
                this._options.set(option.short, option);
            }

            if (option.long) {
                this._options.set(option.long, option);
            }
        });
    }

    invoke(args, options, thisArg = undefined) {
        const numberOfRequiredArguments = this.arguments.filter(x => x.required).length;

        if (args.length < numberOfRequiredArguments) {
            throw new Error("Invalid number of arguments");
        }

        const callArguments = args.concat(this.arguments.slice(args.length).map(arg => 
            typeof arg.defaultValue === "function" 
                ? arg.defaultValue() 
                : arg.defaultValue
        ));

        options.forEach(option => {
            if (!this._optionsMap.has(option.name)) {
                throw new Error("Unknown option '" + option.name + "'")
            }

            const optionInfo = this._optionsMap.get(option.name);

            if (option.value === undefined && optionInfo.hasValue) {
                option.value = optionInfo.defaultValue;
            }
        });

        this.handler.call(thisArg, options, ...callArguments);
    }
}

module.exports = Command;