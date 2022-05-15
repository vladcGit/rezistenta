import React from 'react';

export default function Mission({ mission }) {
  return (
    <div>
      <p>Mission</p>
      <p>{mission.id}</p>
      <p>{mission.is_success ? 'succes' : 'fail'}</p>
    </div>
  );
}
