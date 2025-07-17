import 'dotenv/config';
import { glob } from 'glob';
import esbuild from 'esbuild';
import esbuildPluginInlineImport from 'esbuild-plugin-inline-import';
import { transform } from 'lightningcss';

const entryPoints = glob.sync('./src/**/*.ts');

const ctx = await esbuild.context({
	entryPoints,
	outdir: 'dist',
	bundle: true,
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
	banner: {
		js: 'window.IS_DEV = true;',
	},
});

await ctx.watch();

const res = await ctx.serve({
	servedir: 'dist',
	keyfile: `./${process.env.SSL_KEY_FILE_NAME}`,
	certfile: `./${process.env.SSL_CERT_FILE_NAME}`,
	cors: {
		origin: '*',
	},
});

console.log(`Running on https://${res.hosts[1]}:${res.port}`);
