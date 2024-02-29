import ActivityGraphElement from "./activity-graph-element.mjs";

class ActivityGraph extends HTMLElement {
	constructor() {
		super();
		const attributes = {};

		[
			"range-start",
			"range-end",
			"activity-data",
			"activity-levels",
			"lang",
			"i18n",
		].forEach((attr) => (attributes[attr] = this.getAttribute(attr)));

		this.innerHTML = ActivityGraphElement({
			state: { attrs: attributes },
		});
	}
}

customElements.define("activity-graph", ActivityGraph);
