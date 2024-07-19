import React, { useState, useEffect } from 'react';
import Prescriptions from './Prescriptions';
import Conditions from './Conditions';

const PatientDetails = () => {
    return (
        <div id='patientDetails' style={{ width: '50%', height: '100%' }}>
            <Conditions />
            <Prescriptions />
        </div>
    );

};

export default  PatientDetails;
