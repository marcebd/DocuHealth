import React, { useState, useEffect } from 'react';
import { Button} from 'react-bootstrap';
import AddNewPrescriptionModal from './AddNewPrescriptionModal';
import './AddNewPrescriptionButton.css'
const AddNewPrescriptionButton = ({ styles, className }) => {
    const [viewingPatientId, setViewingPatientId] = useState(localStorage.getItem('viewingPatient'));
    const [showModal, setShowModal] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [prescriptions, setPrescriptions] = useState([{
        name: '',
        dose: '',
        instructions: '',
        dateStart: '',
        dateEnd: ''
    }]);
    const [error, setError] = useState('');

    useEffect(() => {
        const intervalId = setInterval(() => {
        const currentPatientId = localStorage.getItem('viewingPatient');
        if (currentPatientId !== viewingPatientId) {
            setViewingPatientId(currentPatientId);
        }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [viewingPatientId]);

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newPrescriptions = [...prescriptions];
        newPrescriptions[index][name] = value;
        setPrescriptions(newPrescriptions);
        setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isValid = prescriptions.every(prescription =>
        prescription.name.trim() !== '' &&
        prescription.dose.trim() !== '' &&
        prescription.instructions.trim() !== '' &&
        prescription.dateStart.trim() !== ''
        );
        if (!isValid) {
        setError('All fields are required. Please fill in all data.');
        return;
        }

        try {
        const response = await fetch('http://localhost:3002/prescriptions', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prescriptions: prescriptions.map(prescription => ({ ...prescription, patientId: viewingPatientId })) })
        });
        if (response.ok) {
            setPrescriptions([{
            name: '',
            dose: '',
            instructions: '',
            dateStart: '',
            dateEnd: ''
            }]);
            setShowModal(false);
            window.location.reload();
        } else {
            const errorResponse = await response.json();
            setError('Failed to add prescriptions:', errorResponse);
        }
        } catch (error) {
        setError('Error adding prescriptions:', error);
        }
    };

    const addPrescriptionForm = () => {
        setPrescriptions([...prescriptions, {
        name: '',
        dose: '',
        instructions: '',
        dateStart: '',
        dateEnd: ''
        }]);
    };

    return (
        <div style={{width: 'auto', height: 'auto', display:'flex', alignItems:'center'}}>
            <Button onClick={() => setShowModal(true)} style={{fontWeight:'bold'}} className={className} stye={styles}>
                Prescribe Medication
            </Button>
        {showModal && (
            <div>
                <AddNewPrescriptionModal
                showModal={showModal}
                setShowModal={setShowModal}
                prescriptions={prescriptions}
                handleInputChange={handleInputChange}
                addPrescriptionForm={addPrescriptionForm}
                handleSubmit={handleSubmit}
                error={error}
                isHovering={isHovering}
                setIsHovering={setIsHovering}
                />
            </div>
        )}
        </div>
    );
};

export default AddNewPrescriptionButton;
