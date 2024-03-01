import { defineConfig } from "vite";
import enhance from "@enhance/ssr";
import ActivityGraphElement from "./src/activity-graph-element.mjs";

const htmlPlugin = () => {
	return {
		name: "html-transform",
		transformIndexHtml(html) {
			// everything between <!-- client --> and <!-- /client -->

			const render = enhance({
				elements: {
					"activity-graph": ActivityGraphElement,
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
