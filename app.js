const program = require('commander');
const appVersion = require('./package.json').version
const costflow = require('costflow').default;
const fs = require("fs");

/*
 * Parse command arguments
 */
program
    .version(appVersion)
    .option('-c, --config <file_path>', 'costflow config file', 'costflow.json')
    .option('-j, --json', 'output result in json')
    .argument('<command>', 'command to parse');
program.parse(process.argv);

const options = program.opts();
const jsonOutput = options.json || false;
const configPath = options.config;
const args = program.args;

if (args.length !== 1) {
    console.error("too much commands to parse!");
    process.exit(1);
}

const command = args[0];

/*
 * Load config
 */
let config;

try {
    const rawConfig = fs.readFileSync(configPath);
    config = JSON.parse(rawConfig.toString());
} catch (err) {
    console.error(`Cannot load config file. ${err.message}.`);
    process.exit(1);
}

/*
 * Parse command
 */

/**
 * Escape UTF-8 in JSON
 * @param s
 * @returns {*}
 */
function jsonEscapeUTF(s) {
    return s.replace(/[^\x20-\x7F]/g, x => "\\u" + ("000" + x.codePointAt(0).toString(16)).slice(-4))
}

(async () => {
    let ret = await costflow.parse(command, config);
    if (jsonOutput) {
        console.log(jsonEscapeUTF(JSON.stringify(ret)));
    } else {
        console.log(ret.output);
    }
})();