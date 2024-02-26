import CustomElement from "@enhance/custom-element";

class ActivityGraph extends CustomElement {
  constructor() {
    console.log('constructor');
		super();
	}

  static get observedAttributes() {
    return ['range-start', 'range-end', 'week-start', 'activity-data', 'activity-levels'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('attributeChanged', name, oldValue, newValue);
  }


  connectedCallback() {
    console.log('connected');
    this.render({html: this.html, state: this.state});
  }

  render({ html, state }) {
    console.log('render');
    const attrs = state.attrs || {};
    // Now access your attributes via attrs
    const rangeStart = new Date(attrs['range-start'] || new Date().toISOString());
    const rangeEnd = new Date(attrs['range-end'] || new Date().toISOString());
    const weekStart = parseInt(attrs['week-start'] || "0", 10);
    const activityData = attrs['activity-data'] ? attrs['activity-data'].split(",") : [];
    const activityLevels = attrs['activity-levels'] ? attrs['activity-levels'].split(",").map(Number) : [0, 1, 2, 3];


		const dateCounts = activityData.reduce((acc, date) => {
			acc[date] = (acc[date] || 0) + 1;
			return acc;
		}, {});

		return html`
			<table>
				<tr>
					<th>Week</th>
					${Array.from({ length: 7 }).map(
						(_, i) => html`<th>${(i + 1 + weekStart) % 7}</th>`
					)}
				</tr>

				${Array.from({ length: 52 }).map((_, i) => {
					const weekStart = new Date(
						rangeStart.getTime() + i * 7 * 24 * 60 * 60 * 1000
					);
					const weekDates = Array.from({ length: 7 }).map(
						(_, i) =>
							new Date(
								weekStart.getTime() + i * 24 * 60 * 60 * 1000
							)
								.toISOString()
								.split("T")[0]
					);

					return html`
						<tr>
							<td>${i + 1}</td>
							${weekDates.map((date) => {
								const count = dateCounts[date] || 0;
								const level = activityLevels.find(
									(level) => count >= level
								);
								return html`<td class="level-${level}">
									${count}
								</td>`;
							})}
						</tr>
					`;
				})}
			</table>
		`;
	}
}

customElements.define("activity-graph", ActivityGraph);
