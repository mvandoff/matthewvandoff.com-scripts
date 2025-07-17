const entryPoints = glob.sync('./src/**/*.ts');
let ctx = await esbuild.context({
	entryPoints,
	outdir: 'dist',
	bundle: true,
});

let { host, port } = await ctx.serve({
	servedir: 'dist',
});
