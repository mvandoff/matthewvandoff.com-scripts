require('dotenv').config();

const { build } = require('esbuild');
const glob = require('glob');
const esbuildPluginInlineImport = require('esbuild-plugin-inline-import');
const { transform } = require('lightningcss');
const entryPoints = glob.sync('./src/**/*.ts');

build({
	entryPoints,
	bundle: true,
	sourcemap: false,
	minify: true,
	outdir: 'dist',
	plugins: [
		// Always include this plugin before others
		esbuildPluginInlineImport({
			transform: async (contents) => {
				let { code } = transform({
					code: Buffer.from(contents),
					minify: true,
				});
				return code;
			},
		}),
	],
}).catch(() => process.exit(1));
