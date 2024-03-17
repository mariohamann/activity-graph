import ActivityGraphElement from "./activity-graph-element.js";

const attributes = [
	"range-start",
	"range-end",
	"activity-data",
	"activity-levels",
	"first-day-of-week",
	"lang",
	"i18n",
];

class ActivityGraph extends HTMLElement {
	constructor() {
		super();

		// If the element is already enhanced e. g. from the server, do nothing
		if (this.getAttribute("enhanced") === "✨") return;

		// Map attributes that they fit to enhance element
		this.attrs = {};

		attributes.forEach(
			(attr) => (this.attrs[attr] = this.getAttribute(attr))
		);

		// Set default to one year ago
		if (!this.attrs["range-start"]) {
			const date = new Date();
			date.setFullYear(date.getFullYear() - 1);
			this.attrs["range-start"] = date.toISOString().split("T")[0];
		}

		// Set default to today
		if (!this.attrs["range-end"]) {
			this.attrs["range-end"] = new Date().toISOString().split("T")[0];
		}

		// Enables progressive enhancement
		if (this.activityDataFromChildren.length > 0) {
			this.attrs["activity-data"] =
				this.activityDataFromChildren.join(",");
			this.setAttribute("activity-data", this.attrs["activity-data"]);
		}

		this.render();
	}

	static get observedAttributes() {
		return attributes;
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.attrs[name] = newValue;
		this.render();
	}

	render() {
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
