import React, { useState } from 'react';
import './DoctorsHome.css';
import Dock from './Dock';
import MonthlyCalendar from './Calendar/MonthlyCalendar';
import PatientInformation from './PatientInformation/PatientInformation';
import AddPatient from './AddPatient/AddPatient';
import Note from './VisitNote.jsx/Note';
import Prescription from './Prescription/Prescription'


function DoctorsHome() {
    const [components, setComponents] = useState({
        calendar: { component: <MonthlyCalendar />, isVisible: false },
        patientInformation: {component: <PatientInformation />, isVisible: false},
        addPatient: {component: <AddPatient />, isVisible: false},
        addNote: {component: <Note />, isVisible: false},
        addPrescription: {component: <Prescription />, isVisible: false}
        // Add more components as needed
    });

    const toggleComponent = (componentKey) => {
        setComponents(prevComponents => ({
            ...prevComponents,
            [componentKey]: {
                ...prevComponents[componentKey],
                isVisible: !prevComponents[componentKey].isVisible
            }
        }));
    };

    const visibleComponents = Object.keys(components).filter(key => components[key].isVisible);
    const leftGridComponents = visibleComponents.slice(0, 4);
    const rightGridComponents = visibleComponents.slice(4);

    return (
        <div>
            <Dock onToggleComponent={toggleComponent}/>
            <div className="component-grid-container">
                <div className={`component-grid grid-${leftGridComponents.length}`}>
                    {leftGridComponents.map(key => (
                        <div key={key} className="component">
                            {components[key].component}
                        </div>
                    ))}
                </div>
                {rightGridComponents.length > 0 && (
                    <div className={`component-grid grid-${rightGridComponents.length}`}>
                        {rightGridComponents.map(key => (
                            <div key={key} className="component">
                                {components[key].component}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DoctorsHome;
