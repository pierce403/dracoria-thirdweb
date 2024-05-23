import React from 'react';

const Garden: React.FC = () => {
    return (
        <div className="gardenStatsCard card p-4">
            <h3 className="title">Garden Stats</h3>
            <p>Overview of your garden&apos;s performance and stats.</p>
            {/* Example garden stats */}
            <ul>
                <li>Number of Plants: 20</li>
                <li>Water Level: 75%</li>
                <li>Growth Rate: 15% per day</li>
            </ul>
        </div>
    );
};

export default Garden;
