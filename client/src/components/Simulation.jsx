
import React from 'react';

const SimulationEmbed = ({ simulationId }) => {
  return (
    <div className="simulation-embed">
      <p style={{color: "red"}}>
        {simulationId
          ? `Simulation ID: ${simulationId} (would embed real simulation here)`
          : "Simulation not available yet. Coming soon!"}
      </p>
    </div>
  );
};

export default SimulationEmbed;
