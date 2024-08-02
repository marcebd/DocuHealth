import '../NewLook/PatientSearch/PatientSearch.css';
const TableHeader = ({ columns }) => {
    return (
        <div className="table-header" style={{
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
    );
};

export default TableHeader;
