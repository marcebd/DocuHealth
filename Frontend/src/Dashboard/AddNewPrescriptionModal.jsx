import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
function AddNewPrescriptionModal({ showModal, setShowModal, prescriptions, handleInputChange, addPrescriptionForm, handleSubmit, error, isHovering, setIsHovering }) {
    return (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add New Prescription</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                <Form onSubmit={handleSubmit}>
                {prescriptions.map((prescription, index) => (
                    <div key={index}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name<span style={{color: 'red'}}>*</span></Form.Label>
                        <Form.Control
                        type="text"
                        name="name"
                        value={prescription.name}
                        onChange={(e) => handleInputChange(index, e)}
                        required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Dose<span style={{color: 'red'}}>*</span></Form.Label>
                        <Form.Control
                        type="text"
                        name="dose"
                        value={prescription.dose}
                        onChange={(e) => handleInputChange(index, e)}
                        required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Instructions <span style={{color: 'red'}}>*</span></Form.Label>
                        <Form.Control
                        type="text"
                        name="instructions"
                        value={prescription.instructions}
                        onChange={(e) => handleInputChange(index, e)}
                        required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Start Date <span style={{color: 'red'}}>*</span></Form.Label>
                        <Form.Control
                        type="date"
                        name="dateStart"
                        value={prescription.dateStart}
                        onChange={(e) => handleInputChange(index, e)}
                        required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                        type="date"
                        name="dateEnd"
                        value={prescription.dateEnd}
                        onChange={(e) => handleInputChange(index, e)}
                        />
                    </Form.Group>
                    </div>
                ))}
                <div style={{display:'flex', width: '100%', justifyContent: 'center', marginTop:'0%'}}>
                <Button variant="secondary" onClick={addPrescriptionForm} >
                    Add Another Prescription
                </Button>
                </div>
                <div style={{display:'flex', width: '100%', justifyContent: 'center'}}>
                <Button
                    variant="primary"
                    type="submit"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    style={{
                    backgroundColor: isHovering ? '#ffcccc' : 'white',
                    color: 'black',
                    borderColor: '#ccc',
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                    transition: 'background-color 0.3s'
                    }}>
                    Submit
                </Button>
                </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)} >
                Close
                </Button>
            </Modal.Footer>
            </Modal>
    );
}
export default AddNewPrescriptionModal;
