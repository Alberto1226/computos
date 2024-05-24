import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";

const DataTablecustom = ({ datos = [], columnas = [] }) => {
    const [filterValue, setFilterValue] = useState("");
    const [filteredData, setFilteredData] = useState(datos);

    const handleFilterChange = (event) => {
        const searchValue = event.target.value;
        setFilterValue(searchValue);

        if (searchValue.length > 0) {
            const filtered = datos.filter((row) => {
                const lowerCaseRow = row.toString().toLowerCase();
                return Object.values(row).some((value) => {
                    if (value && typeof value === "string") {
                        return value
                            .toLowerCase()
                            .includes(searchValue.toLowerCase());
                    }
                    return false;
                });
            });

            setFilteredData(filtered);
        } else {
            setFilteredData(datos); // Reset to full data when search is empty
        }
    };

    // Initial filter setup
    useEffect(() => {
        setFilteredData(datos); // Set initial filtered data to full data
    }, [datos]);

    return (
        <section>
            <div className="row">
                <div className="col-md-8">
                    <CSVLink data={datos} filename="data.csv">
                        <button className="btn btn-success btn-xs">
                            <span className="fas fa-file-csv" /> Download CSV
                        </button>
                    </CSVLink>
                </div>
                <div className="col-md-4">
                    <div className="input-group">
                        <input
                            type="search"
                            value={filterValue}
                            onChange={handleFilterChange}
                            className="form-control form-control-xs form-control-border"
                            placeholder="Buscar..."
                        />
                        <div className="input-group-append">
                            <button
                                type="submit"
                                className="p-2 btn btn-xs btn-default"
                            >
                                <i className="fa fa-search" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <DataTable
                columns={columnas}
                data={filteredData}
                pagination
                filterValue={filterValue}
                onFilterValueChange={handleFilterChange}
                clearOnFilter
            />
        </section>
    );
};

export default DataTablecustom;
