import ActivityGraphElement from "./activity-graph-element.mjs";

class ActivityGraph extends HTMLElement {
	constructor() {
		super();

		// If the element is already enhanced e. g. from the server, do nothing
		if (this.getAttribute("enhanced") === "✨") return;

		// Map attributes that they fit to enhance element
		this.attrs = {};

		[
			"range-start",
			"range-end",
			"activity-data",
			"activity-levels",
			"first-day-of-week",
			"lang",
			"i18n",
		].forEach((attr) => (this.attrs[attr] = this.getAttribute(attr)));

		this.innerHTML = ActivityGraphElement({
			state: { attrs: this.attrs },
		});
	}

	static get observedAttributes() {
		return [
			"range-start",
			"range-end",
			"activity-data",
			"activity-levels",
			"first-day-of-week",
			"lang",
			"i18n",
		];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.attrs[name] = newValue;
		this.innerHTML = ActivityGraphElement({
			state: { attrs: this.attrs },
		});
	}
}

customElements.define("activity-graph", ActivityGraph);
