// import esbuild
import esbuild from "esbuild";
import fs from "fs";
import { minifyHTMLLiterals } from "minify-html-literals";
import { minify_sync } from "terser";
import dayJsLocales from 'dayjs/locale.json' with { type: 'json' };

(async () => {
  // remove and create dist folder
  if (fs.existsSync("dist")) {
    fs.rmSync("dist", { recursive: true });
  }
  fs.mkdirSync("dist");

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

  // build main wasm
  const locales = dayJsLocales
    .map(locale => locale.key);

  const originalWasm = fs.readFileSync("src/activity-graph-wasm.js", "utf8")

  fs.writeFileSync(
    "dist/activity-graph-wasm.js",
    // import all locales
    originalWasm.replace(
      /\/\* locales \*\/[\s\S]*?\/\* \/locales \*\//,
      `${locales
        .filter(locale => locale !== 'en')
        .map(locale => `import "dayjs/locale/${locale}";`)
        .join('\n')}`
    )
  );

  await esbuild.build({
    entryPoints: ["dist/activity-graph-wasm.js"],
    bundle: true,
    outdir: "dist",
    format: "cjs",
    allowOverwrite: true,
  });

  // create wasm locales
  fs.mkdirSync("dist/activity-graph-wasm");

  locales.forEach(locale => {
    fs.writeFileSync(
      `dist/activity-graph-wasm/${locale}.js`,
      originalWasm
      .replace(
        /\/\* locales \*\/[\s\S]*?\/\* \/locales \*\//,
        locale !== 'en' ? `import "dayjs/locale/${locale}";` : ''
      )
      .replace(
        './activity-graph-element.js',
        '../activity-graph-element.js'
      )
    );
  });

  await esbuild.build({
    entryPoints: ["dist/activity-graph-wasm/*"],
    bundle: true,
    outdir: "dist/activity-graph-wasm",
    format: "cjs",
    allowOverwrite: true,
  });

  // minify all files
  ["activity-graph-element", "activity-graph", "activity-graph-wasm",
    ...locales.map((locale) => `activity-graph-wasm/${locale}`)].forEach(
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

  // generate all final wasms
  ["activity-graph-wasm", "activity-graph-wasm.min",
    ...locales.map((locale) => `activity-graph-wasm/${locale}`), ,
    ...locales.map((locale) => `activity-graph-wasm/${locale}.min`)].forEach((element) => {
    let code = fs.readFileSync(`dist/${element}.js`, "utf8");

    let output = `({ ...rest }) => {`;
    output += code;
    output += `return ActivityGraphWasm({ ...rest });}`;

    fs.writeFileSync(`dist/${element}.js`, output);
  });
})();
