import React from 'react';
import DataTable from 'react-data-table-component';

const DataTableComponent = ({ columns, data, title, pagination, filters, onRowClicked }) => {
  const customStyles = {
    headCells: {
      style: {
        fontWeight: 'bold',
      },
    },
    cells: {
      style: {
        padding: '8px',
      },
    },
  };

  return (
    <div className="data-table-component">
      <DataTable
        title={title}
        columns={columns}
        data={data}
        pagination={pagination}
        customStyles={customStyles}
        highlightOnHover
        pointerOnHover
        onRowClicked={onRowClicked}
      />
    </div>
  );
};

export default DataTableComponent;
