const CommandBuilder = require("../src/command-builder");

const echo = new CommandBuilder("echo", function(options, ...input) {
    console.log(input.join(" "));
});

module.exports = echo.build();