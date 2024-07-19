import React from 'react';
function AddNewPrescriptionModal({ showModal, setShowModal, prescriptions, handleInputChange, addPrescriptionForm, handleSubmit, error, isHovering, setIsHovering }) {
    return (
        <div>
            <button onClick={() => setShowModal(true)}>Open Modal</button>
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
        </div>);
}
export default AddNewPrescriptionModal;
