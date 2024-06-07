import React from 'react';

const Dragon: React.FC = () => {
  return (
    <div className="dragonStatsCard card p-4">
      <h3 className="title">Dragon Stats</h3>
      <p>This is where you'll see your dragon's statistics.</p>
      {/* Additional dragon stats go here */}
      <ul>
        <li>Health: 100</li>
        <li>Strength: 80</li>
        <li>Mana: 40</li>
      </ul>
    </div>
  );
};

export default Dragon;
