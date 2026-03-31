import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

function GrowthChart({ habits }) {
  const [timeframe, setTimeframe] = useState(7); // Default to 7 Days

  const chartData = useMemo(() => {
    const dates = [];
    const counts = {};
    const today = new Date();

    // Dynamically map array sizes based on toggle
    for (let i = timeframe - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      // Label output e.g., "Mon 14"
      const shortLabel = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
      dates.push({ full: dateStr, short: shortLabel });
      counts[dateStr] = 0;
    }

    // Traverse the master JSON mapping and inject hits
    if (habits && habits.length > 0) {
      habits.forEach(habit => {
        if (habit.log) {
          Object.keys(habit.log).forEach(dateStr => {
            if (habit.log[dateStr] === true && counts[dateStr] !== undefined) {
               counts[dateStr] += 1;
            }
          });
        }
      });
    }

    const labels = dates.map(d => d.short);
    const dataPoints = dates.map(d => counts[d.full]);

    return { labels, dataPoints };
  }, [habits, timeframe]);

  // Construct Next-Gen DOM mappings for Chart.js
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        fill: true,
        label: 'Habits Crushed',
        data: chartData.dataPoints,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(168, 85, 247, 0.4)'); // Smooth Violet Alpha
          gradient.addColorStop(1, 'rgba(168, 85, 247, 0.0)');
          return gradient;
        },
        borderColor: '#a855f7',
        borderWidth: 3,
        pointBackgroundColor: '#22d3ee', // Cyber Cyan Nodes
        pointBorderColor: '#0f172a',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        tension: 0.4 // Bezier Algorithm Smoothing
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#22d3ee',
        padding: 16,
        displayColors: false,
        cornerRadius: 12,
        titleFont: { size: 14, family: 'Outfit, sans-serif' },
        bodyFont: { size: 16, weight: 'bold', family: 'Outfit, sans-serif' },
        callbacks: {
           label: function(context) { return `${context.parsed.y} Habits Processed`; }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', stepSize: 1 }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', maxRotation: timeframe === 30 ? 90 : 0 }
      }
    }
  };

  return (
    <div className="bento-card stagger-item" style={{ animationDelay: '0.2s', display: 'flex', flexDirection: 'column', padding: '24px', width: '100%', gridColumn: '1 / -1' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '22px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
           📈 Analytics Engine
        </h3>
        
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <button 
             onClick={() => setTimeframe(7)}
             style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: timeframe === 7 ? 'var(--accent-primary)' : 'transparent', color: timeframe === 7 ? 'white' : 'var(--text-tertiary)', fontWeight: 'bold', transition: 'all 0.3s', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}
          >
            7 Days
          </button>
          <button 
             onClick={() => setTimeframe(30)}
             style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: timeframe === 30 ? 'var(--accent-primary)' : 'transparent', color: timeframe === 30 ? 'white' : 'var(--text-tertiary)', fontWeight: 'bold', transition: 'all 0.3s', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}
          >
            30 Days
          </button>
        </div>
      </div>

      <div style={{ height: '320px', width: '100%', position: 'relative' }}>
         <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default GrowthChart;
