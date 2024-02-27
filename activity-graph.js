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
    html += '<table class="activity-graph">' + this.renderGraph() + '</table>';
    return html;
  }

  getStyle() {
    return `
      .activity-graph {
        border-collapse: collapse;
        font-size: 10px;
      }
      .activity-graph th, .activity-graph td {
        width: 20px;
        height: 20px;
        text-align: center;
        border: 1px solid #ddd;
      }
      .level-0 { background-color: #ebedf0; }
      .level-1 { background-color: #9be9a8; }
      .level-2 { background-color: #40c463; }
      .level-3 { background-color: #30a14e; }
      .level-4 { background-color: #216e39; }
      .disabled { background-color: #f6f8fa; }
    `;
  }

  renderGraph() {
    const toUTCDate = (date) => new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const addDays = (date, days) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days));

    const startDate = toUTCDate(this.rangeStart);
    const endDate = toUTCDate(this.rangeEnd);

    const adjustedStartDate = addDays(startDate, -startDate.getUTCDay());
    const adjustedEndDate = addDays(endDate, 6 - endDate.getUTCDay());

    let headerHtml = '<tr><th></th>';
    let bodyHtml = [];

    for (let day = 0; day < 7; day++) {
      bodyHtml.push(`<tr><th>${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]}</th>`);
    }

    let monthColspan = {};
    let yearColspan = {};
    let lastYear = "";
    let lastMonthYearKey = "";

    for (let date = new Date(adjustedStartDate); date <= adjustedEndDate;) {
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
        const dateKey = `${currentDate.getUTCFullYear()}-${String(currentDate.getUTCMonth() + 1).padStart(2, '0')}-${String(currentDate.getUTCDate()).padStart(2, '0')}`;
        const level = this.isDateInRange(currentDate) ? this.calculateActivityLevel(dateKey) : 'disabled';
        bodyHtml[(date.getUTCDay() + d) % 7] += `<td class="day level-${level}" title="${dateKey}"></td>`;
      }

      date = addDays(date, 7);
    }

    Object.keys(yearColspan).forEach(year => {
      headerHtml += `<th colspan="${yearColspan[year]}">${year}</th>`;
    });

    headerHtml += '</tr><tr><th></th>';

    Object.keys(monthColspan).forEach(monthYear => {
      const [year, month] = monthYear.split('-').map(Number);
      const monthName = new Date(Date.UTC(year, month)).toLocaleString('default', { month: 'short' });
      headerHtml += `<th colspan="${monthColspan[monthYear]}">${monthName}</th>`;
    });

    headerHtml += '</tr>';
    bodyHtml = bodyHtml.map(row => row + '</tr>').join('');

    return headerHtml + bodyHtml;
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
