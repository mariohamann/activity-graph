class ActivityGraph extends HTMLElement {
  constructor() {
    super();
    this.rangeStart = this.parseDateAttribute('range-start');
    this.rangeEnd = this.parseDateAttribute('range-end');
    this.activityData = this.parseActivityData(this.getAttribute('activity-data'));
    this.activityLevels = this.parseActivityLevels(this.getAttribute('activity-levels'));

    this.innerHTML = this.render();
  }

  parseDateAttribute(attrName) {
    const attrValue = this.getAttribute(attrName);
    return attrValue ? new Date(attrValue) : new Date();
  }

  parseActivityData(dataString) {
    if (!dataString) return {};
    return dataString.split(',').reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});
  }

  parseActivityLevels(levelsString) {
    return levelsString ? levelsString.split(',').map(Number) : [0, 1, 2, 3, 4];
  }

  render() {
    let html = '<style>' + this.getStyle() + '</style>';
    html += '<div class="activity-graph">';
    html += this.renderGraph();
    html += '</div>';
    return html;
  }

  getStyle() {
    return `
      .activity-graph {
        display: flex;
        font-size: 10px;
      }
      .activity-graph .day {
        width: 10px;
        height: 10px;
        margin: 1px;
        border-radius: 2px;
      }
      .activity-graph .level-0 { background-color: #ebedf0; }
      .activity-graph .level-1 { background-color: #9be9a8; }
      .activity-graph .level-2 { background-color: #40c463; }
      .activity-graph .level-3 { background-color: #30a14e; }
      .activity-graph .level-4 { background-color: #216e39; }
      .disabled { background-color: #f6f8fa; } /* Disabled style */
    `;
  }

  renderGraph() {
    const toUTCDate = (date) => new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const addDays = (date, days) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days));

    const startDate = toUTCDate(this.rangeStart);
    const endDate = toUTCDate(this.rangeEnd);

    const adjustedStartDate = addDays(startDate, -startDate.getUTCDay());
    const adjustedEndDate = addDays(endDate, 6 - endDate.getUTCDay());

    let weeks = [];
    for (let date = new Date(adjustedStartDate); date <= adjustedEndDate; addDays(date, 1)) {
      const weekIndex = Math.floor(((date - adjustedStartDate) / (1000 * 60 * 60 * 24)) / 7);
      weeks[weekIndex] = weeks[weekIndex] || [];
      const dateKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
      const level = this.isDateInRange(date) ? this.calculateActivityLevel(dateKey) : 'disabled';
      weeks[weekIndex].push(`<div class="day level-${level}" title="${dateKey}"></div>`);
      date = addDays(date, 1);
    }

    return weeks.map(week => `<div class="week">${week.join('')}</div>`).join('');
  }

  isDateInRange(date) {
    const utcDate = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    const startUtc = Date.UTC(this.rangeStart.getUTCFullYear(), this.rangeStart.getUTCMonth(), this.rangeStart.getUTCDate());
    const endUtc = Date.UTC(this.rangeEnd.getUTCFullYear(), this.rangeEnd.getUTCMonth(), this.rangeEnd.getUTCDate());
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
}

customElements.define('activity-graph', ActivityGraph);
