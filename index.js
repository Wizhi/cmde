const Shell = require("./src/shell");
const Command = require("./src/command");
const CommandBuilder = require("./src/command-builder");

module.exports = {
    Shell,
    Command,
    CommandBuilder
};

if (require.main === module) {
    const shell = new Shell();

    require("fs").readdirSync("./commands").forEach(function (file) {
        shell.addCommand(require("./commands/" + file));
    });

    const rl = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const prompt = "> ";

    rl.on("line", input => {
        switch (input) {
            case ".exit":
                rl.close();
                break;
            default:
                const command = shell.parse(input);

                if (shell.hasCommand(command.name)) {
                    shell.evaluate(command);
                } else {
                    console.log("Unknown command '" + command.name + "'");
                }

                rl.setPrompt(prompt);
                rl.prompt();
        }
    });

    rl.setPrompt(prompt);
    rl.prompt();
}