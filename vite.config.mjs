import { defineConfig } from "vite";
import enhance from "@enhance/ssr";
import ActivityGraphElement from "./src/activity-graph-element.mjs";

const htmlPlugin = () => {
	return {
		name: "html-transform",
		transformIndexHtml(html) {
			// everything between <!-- client --> and <!-- /client -->
			const body = html.match(
				/<!-- server -->([\s\S]*)<!-- \/server -->/
			)[1];
			const render = enhance({
				elements: {
					"activity-graph": ActivityGraphElement,
				},
				bodyContent: true,
			});
			return html.replace(body, render`${body}`);
		},
	};
};

export default defineConfig({
	plugins: [htmlPlugin()],
});
