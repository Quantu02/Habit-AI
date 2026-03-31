import React, { useMemo } from 'react';

const HeatMap = ({ habits }) => {
  const { dates, dateCounts } = useMemo(() => {
    const counts = {};
    const dArray = [];
    const today = new Date();
    
    // Generate 364 days (52 weeks * 7 days)
    for (let i = 363; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dArray.push(dateStr);
      counts[dateStr] = 0;
    }

    // Populate actual logs
    if (habits && habits.length > 0) {
      habits.forEach(habit => {
        if (habit.log) {
          Object.keys(habit.log).forEach(dateStr => {
            if (habit.log[dateStr] === true) {
              if (counts[dateStr] !== undefined) {
                 counts[dateStr] += 1;
              }
            }
          });
        }
      });
    }

    return { dates: dArray, dateCounts: counts };
  }, [habits]);

  const getIntensity = (count) => {
    if (count === 0) return 'heat-0';
    if (count === 1) return 'heat-1';
    if (count === 2) return 'heat-2';
    if (count === 3) return 'heat-3';
    return 'heat-4';
  };

  return (
    <div className="bento-card col-span-4 stagger-item" style={{animationDelay: '0.5s'}}>
      <h3 style={{marginBottom: '16px'}}>🗓️ 365-Day Consistency Map</h3>
      <div className="heatmap-container">
        <div className="heatmap-grid" style={{ direction: 'rtl', display: 'grid', gridAutoFlow: 'column' }}>
          {[...dates].reverse().map((dateStr, idx) => (
             <div 
               key={idx} 
               className={`heatmap-cell ${getIntensity(dateCounts[dateStr])}`}
               title={`${dateStr}: ${dateCounts[dateStr]} habits completed`}
             ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeatMap;
