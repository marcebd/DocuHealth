import React, { useState, useEffect } from 'react';

const Table = ({ data, columns, onRowClick, sortKey, sortDirection, onSortChange }) => {
    const [sortedData, setSortedData] = useState([]);

    useEffect(() => {
        sortData(sortDirection);
    }, [data, sortDirection]);

    const sortData = (direction) => {
        const sorted = [...data].sort((a, b) => {
            const valA = a[sortKey].toUpperCase();
            const valB = b[sortKey].toUpperCase();
            return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        });
        setSortedData(sorted);
    };

    return (
        <div>
            <label htmlFor="sortSelect">Sort by {sortKey}:</label>
            <select id="sortSelect" onChange={onSortChange} defaultValue={sortDirection}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                <div style={{ display: 'flex', backgroundColor: '#f2f2f2', padding: '8px', border: '1px solid #ddd' }}>
                    {columns.map(column => (
                        <span key={column.key} style={{ flex: 1 }}>{column.header}</span>
                    ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {sortedData.map((item) => (
                        <div key={item.id} onClick={() => onRowClick(item)} style={{ display: 'flex', padding: '8px', border: '1px solid #ddd' }}>
                            {columns.map(column => (
                                <span key={column.key} style={{ flex: 1, maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {item[column.key]}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Table;
