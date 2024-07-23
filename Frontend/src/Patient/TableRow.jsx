const TableRow = ({ item, columns, onRowClick }) => {
    return (
        <div onClick={() => onRowClick(item)} style={{
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
    );
};

export default TableRow;
