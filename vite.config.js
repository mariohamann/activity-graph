import { defineConfig } from "vite";
import enhance from "@enhance/ssr";
import ActivityGraphWasm from "./src/activity-graph-wasm.js";

const htmlPlugin = () => {
	return {
		name: "html-transform",
		transformIndexHtml(html) {
			// everything between <!-- client --> and <!-- /client -->

			const render = enhance({
				elements: {
					"activity-graph": ActivityGraphWasm,
				},
				bodyContent: false,
			});
			return render`${html}`
				.replaceAll("<!-- client", "")
				.replaceAll("/client -->", "");
		},
	};
};

export default defineConfig({
	plugins: [htmlPlugin()],
});
