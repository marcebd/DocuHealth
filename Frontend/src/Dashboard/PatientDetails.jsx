import React, { useState, useEffect } from 'react';
import Prescriptions from './Prescriptions';
import Conditions from './Conditions';

const PatientDetails = () => {
    return (
        <div id='patientDetails' style={{ width: '50%' }}>
            <Prescriptions />
            <Conditions />
        </div>
    );

};

export default  PatientDetails;
