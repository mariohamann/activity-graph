import { defineConfig } from "vite";
import enhance from "@enhance/ssr";
import ActivityGraphWasm from "./src/activity-graph-wasm.js";

const htmlPlugin = () => {
	return {
		name: "html-transform",
		transformIndexHtml(html) {
			const render = enhance({
				elements: {
					"activity-graph": ActivityGraphWasm,
				},
				bodyContent: false,
			});
			// transform everything between <!-- client --> and <!-- /client -->
			return render`${html}`
				.replaceAll("<!-- client", "")
				.replaceAll("/client -->", "");
		},
	};
};

export default defineConfig({
	plugins: [htmlPlugin()],
  base: "https://mariohamann.github.io/activity-graph/"
});
