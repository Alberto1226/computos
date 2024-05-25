import ContainerLTE from "@/Components/Generales/ContainerLTE";
import ModalCustom from "@/Components/Generales/ModalCustom";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import DataTablecustom from "@/Components/Generales/DataTable";
import CustomDropdownSelect from "@/Components/Generales/CustomDropdownSelect";
import CustomSelect from "@/Components/Generales/CustomSelect";

const Index = () => {
    const [modo, setModo] = useState("");
    const [reloadData, setReloadData] = useState(false);
    const [Descripcion, setDescripcion] = useState("");
    const [id_partidos, setIdPartidos] = useState("");
    const [id_eleccion, setIdEleccion] = useState("");

    const [resetDropdown, setResetDropdown] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);

    const [CoalicionSeleccionada, setCoalicionSeleccionada] = useState(null);

    const [modalEliminacion, setModalEliminacion] = useState(false);
    const [idDetelete, setIdDetelete] = useState(null);

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const AgregarCoalicion = () => {
        const formData = new FormData();
        formData.append("descripcion", Descripcion);
        formData.append("id_partidos", id_partidos);
        formData.append("id_eleccion", selectedValue);
        axios
            .post(route("Coaliciones.Coaliciones.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    setReloadData(true);
                    setDescripcion("");
                    setIdPartidos("");
                    setIdEleccion("");
                    setResetDropdown(true);

                    Swal.fire({
                        title: response.data.message,
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1600,
                    });
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.message,
                    showConfirmButton: false,
                    timer: 1600,
                });
            });
    };

    const Coalicion = () => {
        if (modo === "Agregar") {
            AgregarCoalicion();
        } else if (modo === "Editar") {
            ActualizaCoalicion();
        }
    };

    //listar Partidos Politicos
    const [dataCoalicion, setdataCoalicion] = useState([]);

    // Listado de partidos politicos
    const getCoalicion = async () => {
        try {
            const response = await axios.get(
                `${route("Coaliciones.Coaliciones.listarCoaliciones")}`
            );
            if (response.status === 200) {
                console.log("response", response);
                // Mapear los datos de respuesta para crear un nuevo arreglo de objetos
                const formattedData = response.data.map((Coalicion) => ({
                    id: Coalicion.id,
                    descripcion: Coalicion.descripcion,
                    id_partidos: Coalicion.id_partidos,
                    id_eleccion: Coalicion.id_eleccion,
                }));
                // Establecer los departamentos en el estado
                setdataCoalicion(formattedData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const [dataElecciones, setDataElecciones] = useState([]);
    console.log("dataElecciones", dataElecciones);
    // Listado de Departamentos
    const getElecciones = async () => {
        try {
            const response = await axios.get(
                `${route("Elecciones.Elecciones.listarElecciones")}`
            );
            if (response.status === 200) {
                // Mapear los datos de respuesta para crear un nuevo arreglo de objetos
                const formattedData = response.data.map((distrtio) => ({
                    id: distrtio.id,
                    value: distrtio.nombreEleccion,
                }));
                // Establecer los departamentos en el estado
                setDataElecciones(formattedData);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getCoalicion();
        getElecciones();
        getPartidosPoliticos();
    }, [reloadData]);

    const columns = [
        {
            name: "Descripcion",
            selector: (row) => row.descripcion,
        },

        {
            name: "Partidos",
            // selector: (row) => row.id_partidos,
            selector: (row) =>
                obtenerAbreviaturas(row.id_partidos, dataPartidosPoliticos),
        },
        {
            name: "Seleccion",
            selector: (row) => row.id_eleccion,
        },

        {
            name: "Acciones",
            cell: (row) => (
                <>
                    <button
                        className="btn btn-warning btn-xs"
                        onClick={() => handleEdit(row)}
                    >
                        <span className="fas fa-edit"></span> Editar
                    </button>

                    <button
                        className="btn btn-danger btn-xs"
                        onClick={() => handleDelete(row.id)}
                    >
                        <span className="fas fa-trash"></span> Eliminar
                    </button>
                </>
            ),
        },
    ];

    const obtenerAbreviaturas = (idPartidos, partidosPoliticos) => {
        // Convertir el string de IDs en un array de IDs
        const ids = idPartidos.split(",").map((id) => parseInt(id.trim(), 10));

        // Filtrar la lista de partidos políticos para obtener solo aquellos cuyos IDs coincidan con los IDs en row.id_partidos
        const partidosFiltrados = partidosPoliticos.filter((partido) =>
            ids.includes(partido.id)
        );

        // Mapear los partidos políticos filtrados para obtener solo las abreviaturas
        const abreviaturas = partidosFiltrados.map(
            (partido) => partido.abreviatura
        );

        // Devolver las abreviaturas como una cadena separada por comas
        return abreviaturas.join(", ");
    };

    const handleEdit = (CoalicionSeleccionada) => {
        setModo("Editar");
        setCoalicionSeleccionada(CoalicionSeleccionada);
        setModalOpen(true);
    };

    useEffect(() => {
        // Cuando se abre el modal de edición, establecer los valores de los inputs
        if (modo === "Editar" && CoalicionSeleccionada) {
            setDescripcion(CoalicionSeleccionada.descripcion);
            setIdPartidos(CoalicionSeleccionada.id_partidos);
            setIdEleccion(CoalicionSeleccionada.id_eleccion);
            // console.log(CoalicionSeleccionada.id_partidos);
        } else {
            setDescripcion("");
            setIdPartidos("");
            setIdEleccion("");
        }
    }, [modo, CoalicionSeleccionada]);

    const ActualizaCoalicion = () => {
        const id = CoalicionSeleccionada?.id; // Obtener el ID del partido politico seleccionado

        axios
            .put(route(`Coaliciones.Coaliciones.update`, { id: id }), null, {
                params: {
                    descripcion: Descripcion,
                    id_partidos: id_partidos,
                    id_eleccion: selectedValue,
                },
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    setReloadData(true);
                    handleCloseModal();
                    Swal.fire({
                        title: "Actualizado correctamente",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1600,
                    });
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.message,
                    showConfirmButton: false,
                    timer: 1600,
                });
            });
    };

    useEffect(() => {
        getCoalicion();
        setResetDropdown(false); // Reiniciar el estado de resetDropdown para que siga borrando los datos despues de guardar el registro
        return () => setReloadData(false);
    }, [reloadData]);

    const handleDelete = (idDetelete) => {
        setIdDetelete(idDetelete);
        setModalEliminacion(true);
    };

    const handleConfirmDelete = () => {
        const id = idDetelete;
        axios
            .delete(route(`Coaliciones.Coaliciones.destroy`, { id }))
            .then((response) => {
                if (response.status === 200) {
                    setReloadData(true);
                    Swal.fire({
                        title: "Eliminado correctamente",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1600,
                    });
                    setModalEliminacion(false);
                }
            })
            .catch((error) => {
                console.error("Error al eliminar Coalicion:", error);
            });
    };

    //listar Partidos Politicos
    const [dataPartidosPoliticos, setDataPartidosPoliticos] = useState([]);

    // Listado de partidos politicos
    const getPartidosPoliticos = async () => {
        try {
            const response = await axios.get(
                `${route("PartidosPoliticos.PartidosPoliticos.listarPartidos")}`
            );
            if (response.status === 200) {
                console.log("response", response);
                // Mapear los datos de respuesta para crear un nuevo arreglo de objetos
                const formattedData = response.data.map((PartidoPolitico) => ({
                    id: PartidoPolitico.id,
                    nombrePartido: PartidoPolitico.nombrePartido,
                    abreviatura: PartidoPolitico.abrebiatura,
                    color: PartidoPolitico.color,
                    label: PartidoPolitico.abrebiatura,
                }));
                // Establecer los departamentos en el estado
                setDataPartidosPoliticos(formattedData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const [selectedValue, setSelectedValue] = useState(null);

    const handleSelectChange = (newValue) => {
        setSelectedValue(newValue);
    };

    return (
        <>
            <Authenticated>
                <ContainerLTE
                    title="Coaliciones"
                    buttonadd={
                        <button
                            className="btn btn-success btn-xs "
                            onClick={() => {
                                setModo("Agregar");
                                setModalOpen(true);
                            }}
                        >
                            <span className="fas fa-plus"></span> Agregar
                        </button>
                    }
                >
                    <DataTablecustom columnas={columns} datos={dataCoalicion} />
                </ContainerLTE>
                <ModalCustom
                    tamaño={"lg"}
                    title={modo === "Agregar" ? "Agregar" : "Editar"}
                    isOpen={modalOpen}
                    onClose={handleCloseModal}
                    btnfooter={
                        <button
                            className="btn btn-primary float-end"
                            onClick={Coalicion}
                        >
                            <span className="fas fa-save" /> Guardar
                        </button>
                    }
                >
                    <div className="card-body">
                        <h4>Información de las Coaliciones</h4>
                        <br />
                        <form>
                            <div className="form-group">
                                <label htmlFor="DescripcionInput">
                                    Descripcion <code>*</code>
                                </label>
                                <input
                                    type="text"
                                    className="form-control form-control-border"
                                    id="DescripcionInput"
                                    placeholder="descripcion"
                                    value={Descripcion}
                                    onChange={(event) =>
                                        setDescripcion(event.target.value)
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="ColoursInput">
                                    Partidos Politicos <code>*</code>
                                </label>
                                <CustomDropdownSelect
                                    options={dataPartidosPoliticos}
                                    onChange={(selectedColors) =>
                                        setIdPartidos(selectedColors)
                                    }
                                    reset={resetDropdown} // Pasar resetDropdown al CustomDropdownSelect
                                    selectedIds={id_partidos}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="id_eleccionInput">
                                    Eleccion <code>*</code>
                                </label>
                                <CustomSelect
                                    dataOptions={(Array.isArray(dataElecciones)
                                        ? dataElecciones
                                        : []
                                    ).map((role) => ({
                                        value: `${role.id} `,
                                        label: `${role.value}`,
                                    }))}
                                    preDefaultValue={parseInt(id_eleccion)}
                                    setValue={handleSelectChange}
                                    // Asegúrate de que isDisabled no esté establecido en true después de la primera selección
                                    //isDisabled={depFiltro}
                                />
                            </div>
                        </form>
                    </div>
                </ModalCustom>
                <ModalCustom
                    isOpen={modalEliminacion}
                    onClose={() => setModalEliminacion(false)}
                    title="Confirmar Eliminación"
                    btnfooter={
                        <>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleConfirmDelete()}
                            >
                                Eliminar
                            </button>
                        </>
                    }
                >
                    <p>¿Estás seguro de que quieres eliminar la coalicion?</p>
                </ModalCustom>
            </Authenticated>
        </>
    );
};

export default Index;
