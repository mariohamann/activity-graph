import ActivityGraphElement from "./activity-graph-element.js";

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

		if (this.activityDataFromChildren.length > 0) {
			this.attrs["activity-data"] =
				this.activityDataFromChildren.join(",");
			this.setAttribute("activity-data", this.attrs["activity-data"]);
		}

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

	get activityDataFromChildren() {
		return Array.from(this.querySelectorAll("[data-activity]")).map((el) =>
			el.getAttribute("data-activity")
		);
	}
}

customElements.define("activity-graph", ActivityGraph);
