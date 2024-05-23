import React from 'react';
import Select from 'react-select';

const CustomSelect = ({ dataOptions = [], preDefaultValue = null, setValue, useFilter = false, onInputChange, placeholder, isDisabled = false  }) => {
    const handleSelectChange = (selectedOption) => {
        setValue(selectedOption ? selectedOption.value : null);
    };

    // Función de filtro para la búsqueda en tiempo real (opcional)
    const customFilterOption = (option, rawInput) => {
        const words = rawInput.split('-').map(word => word.trim());
        const regex = new RegExp(words.join('|'), 'i');
        return regex.test(option.label);
    };

    return (
        <Select
            className="basic-single"
            classNamePrefix="select"
            value={dataOptions.find(option => option.value === preDefaultValue)}
            isClearable={true}
            isSearchable={true}
            options={dataOptions}
            onChange={handleSelectChange}
            filterOption={useFilter ? customFilterOption : undefined} // Aplica la función de filtro personalizada si se especifica
            onInputChange={onInputChange} // Agrega esta prop para manejar cambios en el campo de búsqueda
            placeholder={placeholder || "Seleccionar..."}
            isDisabled={isDisabled}
        />
    );
};

export default CustomSelect;
