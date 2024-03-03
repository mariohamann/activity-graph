// import esbuild
import esbuild from "esbuild";
import fs from "fs";
import { minifyHTMLLiterals } from "minify-html-literals";
import { minify_sync } from "terser";

// define the build function
export default async function build() {
	// build the module
	await esbuild.build({
		entryPoints: ["src/activity-graph-wasm.mjs"],
		bundle: true,
		outfile: "dist/activity-graph-wasm.js",
		format: "cjs",
	});

	// minify html & css
	let minified = minifyHTMLLiterals(
		fs.readFileSync("dist/activity-graph-wasm.js", "utf8")
	).code;

	// minify js via terser
	minified = minify_sync(minified).code;

	// alter output to let it work with enhance/ssr
	let output = `({ ...rest }) => {`;
	output += minified;
	output += `return ActivityGraphWasm({ ...rest });}`;

	fs.writeFileSync("dist/activity-graph-wasm.js", output);
}

// run the build function
build();
