(async () => {
    const {build} = require("esbuild")
    const appMain = require('./package.json').main

    await build({
        entryPoints: [appMain],
        outfile: './dist/costflow-parser.js',
        minify: true,
        bundle: true,
        platform: 'node',
    })
})();