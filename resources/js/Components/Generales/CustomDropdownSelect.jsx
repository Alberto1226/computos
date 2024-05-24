import React, { useState, useEffect } from "react";
import Select from "react-select";
import { components } from "react-select";

const CustomDropdownSelect = ({ options, onChange, reset, selectedIds }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        if (reset) {
            setSelectedOptions([]); // Limpiar la selección cuando reset sea true
        }
    }, [reset]);

    useEffect(() => {
        // Cuando se recibe un nuevo conjunto de IDs seleccionados, actualizar la selección
        if (selectedIds && selectedIds.length > 0) {
            const selectedOptions = options.filter(option => selectedIds.includes(option.id));
            setSelectedOptions(selectedOptions);
        }
    }, [selectedIds, options]);

    const handleChange = (selected) => {
        setSelectedOptions(selected);
        const selectedIds = selected.map(option => option.id).join(",");
        onChange(selectedIds);
    };

    const customOption = (props) => {
        return (
            <components.Option {...props}>
                <input
                    type="checkbox"
                    checked={props.isSelected}
                    onChange={() => null}
                />{" "}
                <label>{props.label}</label>
            </components.Option>
        );
    };

    return (
        <Select
            options={options}
            isMulti
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            components={{ Option: customOption }}
            onChange={handleChange}
            value={selectedOptions}
            getOptionValue={(option) => option.id}
            // getOptionLabel={(option) => `${option.nombrePartido} - ${option.abreviatura}`}
            getOptionLabel={(option) => `${option.label}`}
        />
    );
};

export default CustomDropdownSelect;
