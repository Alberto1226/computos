import React, { useState,useEffect } from 'react';
import DataTable from 'react-data-table-component';

const DataTableCustPag = ({ columnas, datos, paginationServer, paginationTotalRows, paginationPerPage, rowsPerPage, setRowsPerPage, page, setPage }) => {

    const handleChangePage = (page) => {
        // //console.log("Nueva pagina "+ newPage)
        setPage(page);
        ////console.log("click")
    };

    const handleChangeRowsPerPage = (newPerPage) => {
        // //console.log("Registros por pagina "+ parseInt(event.target.value, 10))
        setRowsPerPage(newPerPage)
        //setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de'
    };

    const [resetPaginationToogle, setResetPaginationToogle] = useState(false);

    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    const cargarDatos = () => {
        const timeout = setTimeout(() => {
            setRows(datos);
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }

    useEffect(() => {
        cargarDatos();
    }, []);


    return (
        <>
            <DataTable
                columns={columnas}
                data={datos}
                noDataComponent="No hay registros para mostrar"
                progressPending={pending}
                paginationComponentOptions={paginationComponentOptions}
                paginationResetDefaultPage={resetPaginationToogle}
                pagination
                paginationServer
                paginationTotalRows={paginationTotalRows}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                onChangePage={handleChangePage}
            />

        </>
    );
};

export default DataTableCustPag;
