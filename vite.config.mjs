import { defineConfig } from "vite";
import enhance from "@enhance/ssr";
import ActivityGraphElement from "./src/activity-graph-element.mjs";

const htmlPlugin = () => {
	return {
		name: "html-transform",
		transformIndexHtml(html) {
			if (html.includes("/src/activity-graph.mjs")) {
				return html;
			}
			const body = html.match(/<body>([\s\S]*)<\/body>/)[1];
			const render = enhance({
				elements: {
					"activity-graph": ActivityGraphElement,
				},
				bodyContent: false,
			});
			return html.replace(body, render`${body}`);
		},
	};
};

export default defineConfig({
	plugins: [htmlPlugin()],
});
