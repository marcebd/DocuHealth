import React, { useState } from 'react';
import { FaRegCalendarAlt, FaRegEdit } from 'react-icons/fa'; 
import Notepad from "./Notepad";
import PastVisitNotes from './PastVisitNotes';
import VisitTable from './VisitTable';

const VisitInfoGeneral = () => {
    const [viewingPatientId] = useState(localStorage.getItem('viewingPatient'));
    const [showNotepad, setShowNotepad] = useState(false);

    const toggleView = () => {
        setShowNotepad(!showNotepad);
    };

    return (
        <div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid lightgray', borderRadius: '20px' }}>
                    <div
                        style={{
                            padding: '10px 20px',
                            backgroundColor: showNotepad ? 'lightgrey' : 'white',
                            borderTopLeftRadius: '20px',
                            borderBottomLeftRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            color: showNotepad ? 'grey' : 'black'
                        }}
                        onClick={() => setShowNotepad(false)}
                    >
                        <FaRegCalendarAlt style={{ marginRight: '5px' }} />
                        <span>Table</span>
                    </div>
                    <div
                        style={{
                            padding: '10px 20px',
                            backgroundColor: showNotepad ? 'white' : 'lightgrey',
                            borderTopRightRadius: '20px',
                            borderBottomRightRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            color: showNotepad ? 'black' : 'grey'
                        }}
                        onClick={() => setShowNotepad(true)}
                    >
                        <FaRegEdit style={{ marginRight: '5px' }} />
                        <span>Notepad</span>
                    </div>
                </div>
            </div>

            {showNotepad ? (
                <Notepad />
            ) : (
                <VisitTable />
            )}
            <PastVisitNotes patientId={viewingPatientId} />
        </div>
    );
}

export default VisitInfoGeneral;
