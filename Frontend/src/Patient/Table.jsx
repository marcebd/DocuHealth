import React, { useState, useEffect } from 'react';
import ContentLoader from 'react-content-loader';

const Table = ({ data, columns, onRowClick, sortKey, sortDirection, onSortChange, style, loading }) => {
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

    const TableLoader = () => (
        <ContentLoader
            speed={2}
            width={400}
            height={160}
            viewBox="0 0 400 160"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            <rect x="0" y="15" rx="5" ry="5" width="100%" height="20" />
            <rect x="0" y="50" rx="5" ry="5" width="100%" height="20" />
            <rect x="0" y="85" rx="5" ry="5" width="100%" height="20" />
            <rect x="0" y="120" rx="5" ry="5" width="100%" height="20" />
        </ContentLoader>
    );

    return (
        <div style={style}>
            <label htmlFor="sortSelect">Sort by {sortKey}:</label>
            <select id="sortSelect" onChange={onSortChange} defaultValue={sortDirection}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                <div style={{
                    display: 'flex',
                    backgroundColor: '#f2f2f2',
                    padding: '8px',
                    border: '1px solid #ddd',
                    minWidth: '100%'
                }}>
                    {columns.map((column, index) => (
                        <span key={column.key} style={{
                            flex: 1,
                            minWidth: '5%',
                            borderRight: index !== columns.length - 1 ? '1px solid #f0f0f0' : 'none',
                            textAlign: 'center'
                        }}>
                            {column.header}
                        </span>
                    ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {loading ? <TableLoader /> : sortedData.map((item) => (
                        <div key={item.id} onClick={() => onRowClick(item)} style={{
                            display: 'flex',
                            padding: '8px',
                            border: '1px solid #ddd',
                            minWidth: '100%'
                        }}>
                            {columns.map((column, index) => (
                                <span key={column.key} style={{
                                    flex: 1,
                                    minWidth: '5%',
                                    borderRight: index !== columns.length - 1 ? '1px solid #f0f0f0' : 'none',
                                    textAlign: 'center',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
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
