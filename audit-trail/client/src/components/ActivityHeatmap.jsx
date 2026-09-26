import React from 'react';
import Tooltip from './Tooltip';
import './ActivityHeatmap.css';

/**
 * Generate mock heatmap data for the past N weeks.
 * Each cell = 1 day, value = event count.
 */
function generateHeatmapData(weeks = 12) {
  const data = [];
  const now = new Date();
  const totalDays = weeks * 7;

  for (let i = totalDays - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      day: date.getDay(),
      count: Math.random() > 0.3 ? Math.floor(Math.random() * 25) : 0,
    });
  }
  return data;
}

/**
 * Map event count to intensity level (0-4).
 */
function getLevel(count) {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 8) return 2;
  if (count <= 15) return 3;
  return 4;
}

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

/**
 * ActivityHeatmap — GitHub-style contribution/activity heatmap.
 *
 * Shows event frequency over the past N weeks as a color-coded grid.
 * Each cell represents a day, colored by intensity level.
 *
 * @param {number} weeks - Number of weeks to display (default: 12)
 * @param {string} title - Section title (default: 'Event Activity')
 */
function ActivityHeatmap({ weeks = 12, title = 'Event Activity' }) {
  const data = React.useMemo(() => generateHeatmapData(weeks), [weeks]);

  // Group by week columns
  const columns = [];
  for (let i = 0; i < data.length; i += 7) {
    columns.push(data.slice(i, i + 7));
  }

  // Get month labels
  const monthLabels = [];
  let lastMonth = '';
  columns.forEach((week, colIndex) => {
    const firstDay = new Date(week[0].date);
    const month = firstDay.toLocaleString('default', { month: 'short' });
    if (month !== lastMonth) {
      monthLabels.push({ label: month, col: colIndex });
      lastMonth = month;
    }
  });

  const totalEvents = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="heatmap card">
      <div className="heatmap-header">
        <h3 className="heatmap-title">{title}</h3>
        <span className="heatmap-total">{totalEvents.toLocaleString()} events</span>
      </div>

      <div className="heatmap-wrapper">
        {/* Day labels */}
        <div className="heatmap-day-labels">
          {DAY_LABELS.map((label, i) => (
            <span key={i} className="heatmap-day-label">{label}</span>
          ))}
        </div>

        <div className="heatmap-grid-area">
          {/* Month labels */}
          <div className="heatmap-month-labels">
            {monthLabels.map((m, i) => (
              <span
                key={i}
                className="heatmap-month-label"
                style={{ gridColumn: m.col + 1 }}
              >
                {m.label}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className="heatmap-grid" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
            {columns.map((week, colIndex) => (
              <div key={colIndex} className="heatmap-col">
                {week.map((day) => (
                  <Tooltip
                    key={day.date}
                    content={`${day.count} events on ${day.date}`}
                    placement="top"
                  >
                    <div
                      className={`heatmap-cell heatmap-cell--level-${getLevel(day.count)}`}
                    />
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="heatmap-legend">
        <span className="heatmap-legend-label">Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div key={level} className={`heatmap-cell heatmap-cell--level-${level} heatmap-legend-cell`} />
        ))}
        <span className="heatmap-legend-label">More</span>
      </div>
    </div>
  );
}

export default ActivityHeatmap;
