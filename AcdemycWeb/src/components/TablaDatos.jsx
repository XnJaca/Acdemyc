import MaterialReactTable from 'material-react-table';

export const TablaDatos = ({ columns = [], data = [], }) => {

    return (

        <div>
            <MaterialReactTable columns={columns} data={data} />
        </div>
    )
}
