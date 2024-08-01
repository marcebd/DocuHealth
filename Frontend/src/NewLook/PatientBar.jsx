import React, { useState, useEffect } from 'react';
import { IconButton, Button } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import './PatientBar.css';

const PatientBar = ({ onToggleComponent }) => {
    const [pinned, setPinned] = useState(false);
    const [visible, setVisible] = useState(false);
    let hoverTimeout;

    const togglePin = () => {
        setPinned(!pinned);
    };

    const handleMouseEnterEdge = () => {
        setVisible(true);
    };

    const handleMouseLeaveEdge = () => {
        if (!pinned) {
            hoverTimeout = setTimeout(() => {
                setVisible(false);
            }, 100);
        }
    };

    useEffect(() => {
        return () => clearTimeout(hoverTimeout);
    }, []);

    return (
        <div className={`patient-bar ${visible || pinned ? 'visible' : 'hidden'}`}
             onMouseEnter={handleMouseEnterEdge}
             onMouseLeave={handleMouseLeaveEdge}>
            <IconButton onClick={togglePin} color="primary" component="span" className="pin-button">
                {pinned ? <LockIcon /> : <LockOpenIcon />}
            </IconButton>
            <Button onClick={() => onToggleComponent('searchRecords')} style={{ borderRadius: '20px', backgroundColor: '#76D7C4', color: 'white', padding: '10px 20px', marginTop: '50px' }}>
                <FaSearch style={{ marginRight: '8px' }} />
                Search Records
            </Button>
        </div>
    );
};

export default PatientBar;
