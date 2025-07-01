import React from 'react';

const TournamentDetails: React.FC = () => {
  // Use mock data for tournament details
  const tournament = { id: 1, name: 'Mock Tournament 1', start_time: '2024-06-15', participants: 10, description: 'This is a mock tournament.' };

  return (
    <div>
      <h2>{tournament.name}</h2>
      <p>Start Time: {tournament.start_time}</p>
      <p>Participants: {tournament.participants}</p>
      <p>Description: {tournament.description}</p>
    </div>
  );
};

export default TournamentDetails; 