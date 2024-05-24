import ContainerLTE from "@/Components/Generales/ContainerLTE";
import ModalCustom from "@/Components/Generales/ModalCustom";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import DataTablecustom from "@/Components/Generales/DataTable";
import CustomSelect from "@/Components/Generales/CustomSelect";

const Index = () => {
    const [modo, setModo] = useState("");
    const [reloadData, setReloadData] = useState(false);
    const [descripcion, setDescripcion] = useState("");
    const [idDistrito, setIdDistrito] = useState("");
    const [listaNominal, setListaNominal] = useState("");
    const [unidadMedidaSeleccionada, setUnidadMedidaSeleccionada] =
        useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [idDetelete, setidDetelete] = useState(null);
    const [modalOpen2, setModalOpen2] = useState(false);

    const handleCloseModal = () => {
        setModalOpen(false);
    };
    const seccionescrud = () => {
        if (modo === "Agregar") {
            agregarNuevaSeccion();
        } else if (modo === "Editar") {
            updateNuevo();
        }
    };

    const agregarNuevaSeccion = () => {
        const formData = new FormData();
        formData.append("descripcion", descripcion);
        formData.append("id_distrito", idDistrito);
        formData.append("listaNominal", listaNominal);
        axios
            .post(route("Secciones.Secciones.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    setReloadData(true);
                    setDescripcion("");
                    setIdDistrito("");
                    setListaNominal("");

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

    //listar
    const [data, setData] = useState([]);
    // Listado de Departamentos
    const getSecciones = async () => {
        try {
            const response = await axios.get(
                `${route("Secciones.Secciones.listarSecciones")}`
            );
            if (response.status === 200) {
                console.log("secciones", response);
                // Mapear los datos de respuesta para crear un nuevo arreglo de objetos
                const formattedData = response.data.map((unimedida) => ({
                    id: unimedida.id,
                    descripcion: unimedida.descripcion,
                    distrito: unimedida.distrito,
                    listaNominal: unimedida.listaNominal,
                }));
                // Establecer los departamentos en el estado
                setData(formattedData);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const [data2, setData2] = useState([]);

    const getDistritos = async () => {
        try {
            const response = await axios.get(
                `${route("Distritos.Distritos.listarDistritos")}`
            );
            if (response.status === 200) {
                console.log("distritos", response);
                // Mapear los datos de respuesta para crear un nuevo arreglo de objetos
                const formattedData = response.data.map((distrtio) => ({
                    id: distrtio.id,
                    value: distrtio.descripcion,
                }));
                // Establecer los departamentos en el estado
                setData2(formattedData);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getSecciones();
        getDistritos();
        // return () => setReloadData(false);
    }, [reloadData]);

    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
        },

        {
            name: "Descripción",
            selector: (row) => row.descripcion,
        },
        {
            name: "Lista Nominal",
            selector: (row) => row.listaNominal,
        },
        {
            name: "distrito",
            selector: (row) => row.distrito,
        },

        {
            name: "Actions",
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

    /**Editar */
    const updateNuevo = () => {
        const id = unidadMedidaSeleccionada?.id; // Obtener el ID de la unidad de medida seleccionada

        axios
            .put(route(`Secciones.Secciones.update`, { id: id }), null, {
                params: {
                    descripcion: descripcion,
                    id_distrito: idDistrito,
                    listaNominal: listaNominal,
                },
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    setReloadData(true);
                    handleCloseModal();
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

    const handleEdit = (unidadMedida) => {
        // Aquí puedes realizar cualquier acción necesaria antes de abrir el modal de edición
        // Por ejemplo, puedes recuperar los datos de la unidad de medida con el ID proporcionado y llenar el formulario con ellos
        setModo("Editar");
        setUnidadMedidaSeleccionada(unidadMedida); // Pasar la unidad de medida seleccionada
        setModalOpen(true);
        // Lógica para llenar el formulario con los datos de la unidad de medida a editar
    };

    //llenar form editar
    useEffect(() => {
        // Cuando se abre el modal de edición, establecer los valores de los inputs
        if (modo === "Editar" && unidadMedidaSeleccionada) {
            setDescripcion(unidadMedidaSeleccionada.descripcion);
            setIdDistrito(unidadMedidaSeleccionada.distrito);
            setListaNominal(unidadMedidaSeleccionada.listaNominal);
        } else {
            // Si no estamos en modo de edición, resetear los valores de los inputs
            setDescripcion("");
            setIdDistrito("");
            setListaNominal("");
        }
    }, [modo, unidadMedidaSeleccionada]);

    //eliminar
    const handleConfirmDelete = () => {
        const id = idDetelete;
        axios
            .delete(route(`Secciones.Secciones.destroy`, { id }))
            .then((response) => {
                if (response.status === 200) {
                    setReloadData(true);
                    Swal.fire({
                        title: response.data.message,
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1600,
                    });
                    setModalOpen2(false);
                }
            })
            .catch((error) => {
                console.error("Error al eliminar la unidad de medida:", error);
            });
    };

    const handleDelete = (idDetelete) => {
        // Aquí puedes realizar cualquier acción necesaria antes de abrir el modal de edición
        // Por ejemplo, puedes recuperar los datos de la unidad de medida con el ID proporcionado y llenar el formulario con ellos
        console.log("clic" + idDetelete);
        setidDetelete(idDetelete); // Pasar la unidad de medida seleccionada
        setModalOpen2(true);
        // Lógica para llenar el formulario con los datos de la unidad de medida a editar
    };

    const handleSelectChange = (event) => {
        setIdDistrito(event);
        // console.log(event);
    };

    /**carga por csv */
    const [uploadProgress, setUploadProgress] = useState(0);
    const [file, setFile] = useState(null);
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    const handleUpload = () => {
        const formData = new FormData();
        formData.append("csv_file", file);

        axios
            .post(route("Secciones.Secciones.storeFromCSV"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100
                    );
                    setUploadProgress(progress);
                },
            })
            .then((response) => {
                setReloadData(true);
                setUploadProgress(0);
                Swal.fire({
                    icon: "success",
                    title: "¡Éxito!",
                    text: "Carga de csv correcta",
                });
            })
            .catch((error) => {
                setUploadProgress(0);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Hubo un error al subir el archivo.",
                });
                console.error(error);
            });
    };

    return (
        <>
            <Authenticated>
                <ContainerLTE
                    title="Secciones"
                    buttonadd={
                        <>
                           
                            <button
                                className="btn btn-success btn-xs "
                                onClick={() => {
                                    setModo("Agregar");
                                    setModalOpen(true);
                                    //setUnidadMedidaSeleccionada(null);
                                }}
                            >
                                <span className="fas fa-plus"></span> Agregar
                            </button>
                        </>
                    }
                >
                     <div>
                                <input
                                    type="file"
                                    name="csv_file"
                                    onChange={handleFileChange}
                                />
                                <button
                                    className="btn btn-secondary btn-xs "
                                    onClick={handleUpload}
                                >
                                    <span className="fas fa-file-csv" /> Subir
                                    CSV
                                </button>
                                {uploadProgress > 0 && (
                                    <div>
                                        <p>
                                            Progreso de carga: {uploadProgress}%
                                        </p>
                                        <progress
                                            value={uploadProgress}
                                            max="100"
                                        />
                                    </div>
                                )}
                            </div>
                            <hr className="m-3"/>
                    <DataTablecustom columnas={columns} datos={data} />
                </ContainerLTE>
                <ModalCustom
                    tamaño={"lg"}
                    title={modo === "Agregar" ? "Agregar" : "Editar"}
                    isOpen={modalOpen}
                    onClose={handleCloseModal}
                    btnfooter={
                        <button
                            className="btn btn-primary float-end"
                            onClick={seccionescrud}
                        >
                            <span className="fas fa-save" /> Guardar
                        </button>
                    }
                >
                    <div className="card-body">
                        <h4>Información de la Sección</h4>
                        <br />
                        <form>
                            <div className="form-group">
                                <label htmlFor="descripcionInput">
                                    Descripción <code>*</code>
                                </label>
                                <input
                                    type="text"
                                    className="form-control form-control-border"
                                    id="descripcionInput"
                                    placeholder="Descripción"
                                    value={descripcion}
                                    onChange={(event) =>
                                        setDescripcion(event.target.value)
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="listaNominalInput">
                                    Lista Nominal<code>*</code>
                                </label>
                                <input
                                    type="text"
                                    className="form-control form-control-border"
                                    id="listaNominalInput"
                                    placeholder="lista nominal"
                                    value={listaNominal}
                                    onChange={(event) =>
                                        setListaNominal(event.target.value)
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="idDistritoInput">
                                    ID de Distrito <code>*</code>
                                </label>

                                <CustomSelect
                                    dataOptions={data2.map((role) => ({
                                        value: `${role.id} `,
                                        label: `${role.value}`,
                                    }))}
                                    preDefaultValue={parseInt(idDistrito)}
                                    setValue={handleSelectChange}
                                    //isDisabled={depFiltro}
                                />
                            </div>
                        </form>
                    </div>
                </ModalCustom>
                <ModalCustom
                    isOpen={modalOpen2}
                    onClose={() => setModalOpen2(false)}
                    title="Confirmar Eliminación"
                    btnfooter={
                        <>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setModalOpen2(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleConfirmDelete()}
                            >
                                Eliminar
                            </button>
                        </>
                    }
                >
                    <p>¿Estás seguro de que quieres eliminar esta seccion?</p>
                </ModalCustom>
            </Authenticated>
        </>
    );
};

export default Index;
