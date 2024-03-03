import ActivityGraphElement from "./activity-graph-element.mjs";

class ActivityGraph extends HTMLElement {
	constructor() {
		super();

		// If the element is already enhanced e. g. from the server, do nothing
		if (this.getAttribute("enhanced") === "✨") return;

		// Map attributes that they fit to enhance element
		const attributes = {};

		[
			"range-start",
			"range-end",
			"activity-data",
			"activity-levels",
			"lang",
			"i18n",
			"first-day-of-week",
		].forEach((attr) => (attributes[attr] = this.getAttribute(attr)));

		this.innerHTML = ActivityGraphElement({
			state: { attrs: attributes },
		});
	}
}

customElements.define("activity-graph", ActivityGraph);
