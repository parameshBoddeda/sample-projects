import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const DataTable = (props) => {
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedIds, setSelectedIds] = React.useState([]);

  return (
    <div className={props.applyCustomClass ? props.applyCustomClass : ''}>
      <DataGrid
        density="compact"
        rows={props.rows}        
        columns={props.columns}
        pageSize={pageSize}
        rowsPerPageOptions={[10, 20, 50, 100]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        checkboxSelection
        BaseTooltip={"Hello"}
        onSelectionModelChange={(ids) => {
          setSelectedIds(ids);
          if(props.setSelectedIds){
            props.setSelectedIds(ids);
          }
        }}
      />
    </div>
  );
}

export default DataTable;