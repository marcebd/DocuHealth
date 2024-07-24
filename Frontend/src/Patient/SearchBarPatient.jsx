import React from 'react';

const SearchBarPatient = ({ onChange}) => {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', height: '4vh'}}>
        <input
          type="text"
          placeholder="Search for a patient"
          onChange={onChange}
          style={{ width: '100%', fontSize: '16px', border: 'none', marginBottom: 'none',  height: '2vh' }}
        />
      </div>
    </div>
  );
};

export default SearchBarPatient;
