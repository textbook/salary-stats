export function formatChartPoint() {
  if (this.point.options.hasOwnProperty('median')) {
    return formatBoxPlotPoint(this.point.options, this.key);
  }
  return formatOutlierPoint(this.point.options || {});
}

function formatBoxPlotPoint({ low, q1, median, q3, high }, key) {
  return `<strong>Cohort ${key}</strong><br>
          Upper fence: £${high.toLocaleString()}<br>
          Upper quartile: £${q3.toLocaleString()}<br>
          Median: £${median.toLocaleString()}<br>
          Lower quartile: £${q1.toLocaleString()}<br>
          Lower fence: £${low.toLocaleString()}`;
}

function formatOutlierPoint({ y, name }) {
  return `<strong>${name}</strong><br>
          Salary: £${y.toLocaleString()}`;
}
