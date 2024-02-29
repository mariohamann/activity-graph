const html = String.raw;
const css = String.raw;

class ActivityGraph extends HTMLElement {
	constructor() {
		super();
		this.rangeStart = this.parseDateAttribute("range-start");
		this.rangeEnd = this.parseDateAttribute("range-end");
		this.activityData = this.parseActivityData(
			this.getAttribute("activity-data")
		);
		this.activityLevels = this.parseActivityLevels(
			this.getAttribute("activity-levels")
		);

		this.innerHTML = this.render();
		this.lang = this.getAttribute("lang") || "default";
	}

	parseDateAttribute(attrName) {
		const attrValue = this.getAttribute(attrName);
		return attrValue ? new Date(attrValue) : new Date();
	}

	parseActivityData(dataString) {
		if (!dataString) return {};
		return dataString.split(",").reduce((acc, curr) => {
			acc[curr] = (acc[curr] || 0) + 1;
			return acc;
		}, {});
	}

	parseActivityLevels(levelsString) {
		return levelsString
			? levelsString.split(",").map(Number)
			: [0, 1, 2, 3, 4];
	}

	render() {
		let innerHtml = html`<style>
			${this.getStyle()}
		</style>`;
		innerHtml += html`<figure>
			<table>
				<tbody>
					${this.renderGraph()}
				</tbody>
			</table>
			<figcaption>${this.generateLegend()}</figcaption>
		</figure>`;
		return innerHtml;
	}

	renderGraph() {
		const toUTCDate = (date) =>
			new Date(
				Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
			);
		const addDays = (date, days) =>
			new Date(
				Date.UTC(
					date.getUTCFullYear(),
					date.getUTCMonth(),
					date.getUTCDate() + days
				)
			);

		const startDate = toUTCDate(this.rangeStart);
		const endDate = toUTCDate(this.rangeEnd);

		const adjustedStartDate = addDays(startDate, -startDate.getUTCDay());
		const adjustedEndDate = addDays(endDate, 6 - endDate.getUTCDay());

		// Generate headers for weekdays
		const weekDayHeaders = Array.from({ length: 7 }, (_, day) => {
			const longWeekDay = new Date(
				Date.UTC(2021, 0, day + 3)
			).toLocaleString(this.lang, { weekday: "long" });
			const shortWeekDay = new Date(
				Date.UTC(2021, 0, day + 3)
			).toLocaleString(this.lang, { weekday: "short" });
			return html`<th class="weekday">
				<span class="sr-only">${longWeekDay}</span
				><span aria-hidden="true">${shortWeekDay}</span>
			</th>`;
		});

		let monthColspan = {};
		let yearColspan = {};
		let lastYear = "";
		let lastMonthYearKey = "";
		let bodyRows = Array.from({ length: 7 }, () => []);

		for (
			let date = new Date(adjustedStartDate);
			date <= adjustedEndDate;

		) {
			const weekDay = date.getUTCDay();
			const weekEndDate = addDays(date, 6 - weekDay);
			const monthYearKey = `${weekEndDate.getUTCFullYear()}-${weekEndDate.getUTCMonth()}`;

			if (lastMonthYearKey !== monthYearKey) {
				if (lastYear !== `${weekEndDate.getUTCFullYear()}`) {
					lastYear = `${weekEndDate.getUTCFullYear()}`;
					yearColspan[lastYear] = 1;
				} else {
					yearColspan[lastYear]++;
				}
				monthColspan[monthYearKey] = 1;
				lastMonthYearKey = monthYearKey;
			} else {
				monthColspan[monthYearKey]++;
				yearColspan[lastYear]++;
			}

			for (let d = 0; d < 7; d++) {
				const currentDate = addDays(date, d);
				const dateKey = `${currentDate.getUTCFullYear()}-${String(
					currentDate.getUTCMonth() + 1
				).padStart(2, "0")}-${String(currentDate.getUTCDate()).padStart(
					2,
					"0"
				)}`;
				const level = this.isDateInRange(currentDate)
					? this.calculateActivityLevel(dateKey)
					: "disabled";
				const text = `${dateKey} – Activities: ${
					this.activityData[dateKey] || 0
				}`;
				bodyRows[d].push(
					html`<td class="day level-${level}" title="${text}">
						<span class="sr-only">${text}</span>
					</td>`
				);
			}

			date = addDays(date, 7);
		}

		// Constructing the year and month headers
		const yearHeaders = Object.entries(yearColspan)
			.map(
				([year, span]) =>
					html`<th class="year" colspan="${span}" scope="colgroup">
						<span>${year}</span>
					</th>`
			)
			.join("");

		const monthHeaders = Object.keys(monthColspan)
			.map((monthYear) => {
				const [year, month] = monthYear.split("-").map(Number);
				const monthName = new Date(
					Date.UTC(year, month)
				).toLocaleString(this.lang, { month: "short" });
				return html`<th
					class="month"
					colspan="${monthColspan[monthYear]}"
					scope="colgroup"
				>
					<span aria-hidden="true">${monthName}</span>
				</th>`;
			})
			.join("");

		const headerHtml = html`<tr>
				<th></th>
				${yearHeaders}
			</tr>
			<tr>
				<th></th>
				${monthHeaders}
			</tr>`;
		const bodyHtml = bodyRows
			.map(
				(row) =>
					html`<tr>
						${weekDayHeaders.shift()}${row.join("")}
					</tr>`
			)
			.join("");

		return headerHtml + bodyHtml;
	}

	isDateInRange(date) {
		const utcDate = Date.UTC(
			date.getUTCFullYear(),
			date.getUTCMonth(),
			date.getUTCDate()
		);
		const startUtc = Date.UTC(
			this.rangeStart.getUTCFullYear(),
			this.rangeStart.getUTCMonth(),
			this.rangeStart.getUTCDate()
		);
		const endUtc = Date.UTC(
			this.rangeEnd.getUTCFullYear(),
			this.rangeEnd.getUTCMonth(),
			this.rangeEnd.getUTCDate()
		);
		return utcDate >= startUtc && utcDate <= endUtc;
	}

	calculateActivityLevel(date) {
		const activityCount = this.activityData[date] || 0;
		for (let i = this.activityLevels.length - 1; i >= 0; i--) {
			if (activityCount >= this.activityLevels[i]) {
				return i;
			}
		}
		return 0;
	}

	getLegendText(index) {
		const count = this.activityLevels[index];
		const nextCount = this.activityLevels[index + 1] || null;

		if (nextCount) {
			return `Activities: ${count}${
				nextCount - count > 1 ? `–${nextCount - 1}` : ""
			}`;
		}
		return `Activities: >${count}`;
	}

	generateLegend() {
		let legendHtml = "";
		this.activityLevels.forEach((level, index) => {
			legendHtml += html`<div
				class="day level-${index}"
				title="${this.getLegendText(index)}"
			>
				<span class="sr-only">${this.getLegendText(index)}</span>
			</div>`;
		});

		legendHtml = html`
			<div>Less</div>
			${legendHtml}
			<div>More</div>
		</div>`;
		return legendHtml;
	}

	getStyle() {
		return css`
			/* Global */
			activity-graph {
				color-scheme: light dark;
				font-size: 12px;
				display: block;
			}
			activity-graph figure {
				overflow-x: auto;
				margin: 0;
				position: relative;
				display: block;
			}
			activity-graph table {
				width: max-content;
			}
			activity-graph th,
			activity-graph td {
				text-align: left;
			}

			/* Theming */
			:root {
				--activity-graph-rounded: 2px;
				--activity-graph-text-color: white;
				--activity-graph-text-weight: 400;
				--activity-graph-font-size: 12px;
			}
			:root,
			activity-graph.dark {
				--activity-graph-level-0-bg: #161b22;
				--activity-graph-level-0-border: rgba(27, 31, 35, 0.06);
				--activity-graph-level-1-bg: #0e4429;
				--activity-graph-level-1-border: rgba(255, 255, 255, 0.05);
				--activity-graph-level-2-bg: #006d32;
				--activity-graph-level-2-border: rgba(255, 255, 255, 0.05);
				--activity-graph-level-3-bg: #26a641;
				--activity-graph-level-3-border: rgba(255, 255, 255, 0.05);
				--activity-graph-level-4-bg: #39d353;
				--activity-graph-level-4-border: rgba(255, 255, 255, 0.05);
				--activity-graph-disabled-bg: transparent;
			}
			@media (prefers-color-scheme: light) {
				:root {
					--activity-graph-text-color: #24292e;
					--activity-graph-level-0-bg: #ebedf0;
					--activity-graph-level-0-border: rgba(27, 31, 35, 0.06);
					--activity-graph-level-1-bg: #9be9a8;
					--activity-graph-level-1-border: rgba(27, 31, 35, 0.06);
					--activity-graph-level-2-bg: #40c463;
					--activity-graph-level-2-border: rgba(27, 31, 35, 0.06);
					--activity-graph-level-3-bg: #30a14e;
					--activity-graph-level-3-border: rgba(27, 31, 35, 0.06);
					--activity-graph-level-4-bg: #216e39;
					--activity-graph-level-4-border: rgba(27, 31, 35, 0.06);
					--activity-graph-disabled-bg: transparent;
					--activity-graph-disabled-border: rgba(27, 31, 35, 0.06);
				}
			}

			/* Headings */
			activity-graph th {
				font-weight: var(--activity-graph-text-weight);
				color: var(--activity-graph-text-color);
				text-align: left;
				position: relative;
			}
			activity-graph th.weekday {
				width: 3em;
				height: 1em;
			}
			activity-graph th.year,
			activity-graph th.month {
				height: 1.25em;
			}
			activity-graph th span {
				clip-path: none;
				position: absolute;
				top: -0.2em;
			}
			activity-graph th.weekday span {
				top: -0.2em;
			}
			activity-graph tr:nth-of-type(2n + 1) th.weekday span,
			.sr-only {
				clip: rect(0 0 0 0);
				clip-path: inset(50%);
				height: 1px;
				overflow: hidden;
				position: absolute;
				left: 0;
				top: 0;
				white-space: nowrap;
				width: 1px;
			}

			/* Cells */
			activity-graph .day {
				width: 1em;
				height: 1em;
				outline-offset: -1px;
				border-radius: var(--activity-graph-rounded);
			}
			activity-graph .level-0 {
				background-color: var(--activity-graph-level-0-bg);
				outline: 1px solid var(--activity-graph-level-0-border);
			}
			activity-graph .level-1 {
				background-color: var(--activity-graph-level-1-bg);
				outline: 1px solid var(--activity-graph-level-1-border);
			}
			activity-graph .level-2 {
				background-color: var(--activity-graph-level-2-bg);
				outline: 1px solid var(--activity-graph-level-2-border);
			}
			activity-graph .level-3 {
				background-color: var(--activity-graph-level-3-bg);
				outline: 1px solid var(--activity-graph-level-3-border);
			}
			activity-graph .level-4 {
				background-color: var(--activity-graph-level-4-bg);
				outline: 1px solid var(--activity-graph-level-4-border);
			}
			activity-graph .disabled {
				background-color: var(--activity-graph-disabled-bg);
			}
			/* Legend */
			activity-graph figcaption {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 0.25em;
				margin-top: -1.25em;
				position: fixed;
				left: 50%;
				transform: translateX(-50%);
			}
			activity-graph table {
				margin-bottom: 2em;
			}
			activity-graph figcaption div:first-of-type {
				margin-right: 0.5em;
			}
			activity-graph figcaption div:last-of-type {
				margin-left: 0.5em;
			}
		`;
	}
}

customElements.define("activity-graph", ActivityGraph);
