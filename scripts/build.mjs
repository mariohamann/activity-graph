// import esbuild
import esbuild from "esbuild";
import fs from "fs";
import { minifyHTMLLiterals } from "minify-html-literals";
import { minify_sync } from "terser";

(async () => {
	// copy element
	fs.writeFileSync(
		"dist/activity-graph-element.js",
		fs.readFileSync("src/activity-graph-element.js", "utf8")
	);

	// bundle web component
	await esbuild.build({
		entryPoints: ["src/activity-graph.js"],
		bundle: true,
		outdir: "dist",
	});

	// build pre-wasm
	await esbuild.build({
		entryPoints: ["src/activity-graph-wasm.js"],
		bundle: true,
		outdir: "dist",
		format: "cjs",
	});

	// minify
	["activity-graph-element", "activity-graph", "activity-graph-wasm"].forEach(
		(element) => {
			// minify html & css
			let minified = minifyHTMLLiterals(
				fs.readFileSync(`dist/${element}.js`, "utf8")
			).code;

			// minify js via terser
			minified = minify_sync(minified).code;

			// remove all tabs and line breaks
			minified = minified.replaceAll("\t", "").replaceAll("\n", "");

			fs.writeFileSync(`dist/${element}.min.js`, minified);
		}
	);

	// generate final wasm
	["activity-graph-wasm", "activity-graph-wasm.min"].forEach((element) => {
		let code = fs.readFileSync(`dist/${element}.js`, "utf8");

		let output = `({ ...rest }) => {`;
		output += code;
		output += `return ActivityGraphWasm({ ...rest });}`;

		fs.writeFileSync(`dist/${element}.js`, output);
	});
})();
