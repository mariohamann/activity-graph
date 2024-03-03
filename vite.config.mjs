import { defineConfig } from "vite";
import enhance from "@enhance/ssr";
import ActivityGraphWasm from "./src/activity-graph-wasm.mjs";

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
				.replace("<!-- client", "")
				.replace("/client -->", "");
		},
	};
};

export default defineConfig({
	plugins: [htmlPlugin()],
});
