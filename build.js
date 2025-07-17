require('dotenv').config();

const { build } = require('esbuild');
const glob = require('glob');
const dns = require('node:dns');
const os = require('node:os');
const options = { family: 4 };

const inlineImportPlugin = require('esbuild-plugin-inline-import');

const entryPoints = glob.sync('./src/**/*.ts');

let url;
dns.lookup(os.hostname(), options, (err, addr) => {
	if (err) {
		console.error(err);
	} else {
		url = `https://${addr}:${process.env.SERVER_PORT}`;
		console.log(`Server running on: https://${addr}:${process.env.SERVER_PORT}`);
	}
});

console.log(url);

build({
	entryPoints,
	bundle: true,
	sourcemap: false,
	minify: true,
	outdir: 'dist',
	watch: process.argv.includes('--watch'),
	plugins: [
		// Always include this plugin before others
		inlineImportPlugin(),
	],
}).catch(() => process.exit(1));
