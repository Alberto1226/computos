import ContainerLTE from "@/Components/Generales/ContainerLTE";
import ModalCustom from "@/Components/Generales/ModalCustom";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import DataTablecustom from "@/Components/Generales/DataTable";
import { HexColorInput, HexColorPicker } from "react-colorful";

const Index = () => {
    const [modo, setModo] = useState("");
    const [reloadData, setReloadData] = useState(false);
    const [NombrePartido, setNombrePartido] = useState("");
    const [AbreviaturaPartido, setAbreviaturaPartido] = useState("");
    const [ColorPartido, setColorPartido] = useState("#aabbcc");
    const [selectedFile, setSelectedFile] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);

    const [PartidoPoliticoSeleccionado, setPartidoPoliticoSeleccionado] =
        useState(null);

    const [modalEliminacion, setModalEliminacion] = useState(false);
    const [idDetelete, setIdDetelete] = useState(null);

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleFileChange = (event) => {
        console.log(event.target.files[0]);
        setSelectedFile(event.target.files[0]);
    };

    const AgregarPartidoPolitico = () => {
        const formData = new FormData();
        formData.append("nombre", NombrePartido);
        formData.append("abreviatura", AbreviaturaPartido);
        formData.append("color", ColorPartido);
        formData.append("imagen", selectedFile);
        axios
            .post(
                route("PartidosPoliticos.PartidosPoliticos.store"),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then((response) => {
                if (response.status === 200) {
                    setReloadData(true);
                    setNombrePartido("");
                    setAbreviaturaPartido("");
                    setColorPartido("");
                    setSelectedFile("");

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

    const PartidosPoliticos = () => {
        if (modo === "Agregar") {
            AgregarPartidoPolitico();
        } else if (modo === "Editar") {
            ActualizaPartidoPolitico();
        }
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
                    img: PartidoPolitico.imagen,
                }));
                // Establecer los departamentos en el estado
                setDataPartidosPoliticos(formattedData);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getPartidosPoliticos();
    }, [reloadData]);

    const columns = [
        {
            name: "Nombre",
            selector: (row) => row.nombrePartido,
        },

        {
            name: "Abreviatura",
            selector: (row) => row.abreviatura,
        },
        {
            name: "Imagen",
            cell: (row) => (
                <>
                    <img
                        src={`public/storage/${row.img}`}
                        //src={`/storage/${row.img}`}
                        alt="Imagen del partido"
                        style={{
                            width: "30px",
                            height: "30px",
                        }}
                    />
                </>
            ),
        },
        {
            name: "Color",
            cell: (row) => (
                <>
                    <div
                        style={{
                            backgroundColor: row.color,
                            width: "20px",
                            height: "20px",
                        }}
                    ></div>
                </>
            ),
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

    const handleEdit = (PartidoPoliticoSeleccionado) => {
        setModo("Editar");
        setPartidoPoliticoSeleccionado(PartidoPoliticoSeleccionado);
        setModalOpen(true);
    };

    useEffect(() => {
        // Cuando se abre el modal de edición, establecer los valores de los inputs
        if (modo === "Editar" && PartidoPoliticoSeleccionado) {
            setNombrePartido(PartidoPoliticoSeleccionado.nombrePartido);
            setAbreviaturaPartido(PartidoPoliticoSeleccionado.abreviatura);
            setColorPartido(PartidoPoliticoSeleccionado.color);
        } else {
            setNombrePartido("");
            setAbreviaturaPartido("");
            setColorPartido("");
        }
    }, [modo, PartidoPoliticoSeleccionado]);

    const ActualizaPartidoPolitico = () => {
        const id = PartidoPoliticoSeleccionado?.id; // Obtener el ID del partido politico seleccionado
        const formData = new FormData();
        formData.append("nombre", NombrePartido);
        formData.append("abreviatura", AbreviaturaPartido);
        formData.append("color", ColorPartido);
        formData.append("imagen", selectedFile);
        axios
            .post(
                route(`PartidosPoliticos.PartidosPoliticos.update`, { id: id }),
                formData,
                {
                 
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
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
        getPartidosPoliticos();
        return () => setReloadData(false);
    }, [reloadData]);

    const handleDelete = (idDetelete) => {
        setIdDetelete(idDetelete);
        setModalEliminacion(true);
    };

    const handleConfirmDelete = () => {
        const id = idDetelete;
        axios
            .delete(
                route(`PartidosPoliticos.PartidosPoliticos.destroy`, { id })
            )
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
                console.error("Error al eliminar Partido politico:", error);
            });
    };

    return (
        <>
            <Authenticated>
                <ContainerLTE
                    title="Partidos Politicos"
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
                    <DataTablecustom
                        columnas={columns}
                        datos={dataPartidosPoliticos}
                    />
                </ContainerLTE>
                <ModalCustom
                    tamaño={"lg"}
                    title={modo === "Agregar" ? "Agregar" : "Editar"}
                    isOpen={modalOpen}
                    onClose={handleCloseModal}
                    btnfooter={
                        <button
                            className="btn btn-primary float-end"
                            onClick={PartidosPoliticos}
                        >
                            <span className="fas fa-save" /> Guardar
                        </button>
                    }
                >
                    <div className="card-body">
                        <h4>Información de los Partidos Politicos</h4>
                        <br />
                        <form>
                            <div className="form-group">
                                <label htmlFor="NombrePartidoInput">
                                    Nombre del Partido <code>*</code>
                                </label>
                                <input
                                    type="text"
                                    className="form-control form-control-border"
                                    id="NombrePartidoInput"
                                    placeholder="Nombre del Partido"
                                    value={NombrePartido}
                                    onChange={(event) =>
                                        setNombrePartido(event.target.value)
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="AbreviaturaPartidoInput">
                                    Abreviatura <code>*</code>
                                </label>
                                <input
                                    type="text"
                                    className="form-control form-control-border"
                                    id="AbreviaturaPartidoInput"
                                    placeholder="Abreviatura del Partido"
                                    value={AbreviaturaPartido}
                                    onChange={(event) =>
                                        setAbreviaturaPartido(
                                            event.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="ColorPartidoInput">
                                    Color <code>*</code>
                                </label>
                                <div className="d-flex justify-content-center">
                                    <HexColorPicker
                                        color={ColorPartido}
                                        onChange={setColorPartido}
                                    />
                                </div>

                                <input
                                    type="text"
                                    className="form-control form-control-border"
                                    id="ColorPartidoInput"
                                    placeholder="Color del Partido"
                                    value={ColorPartido}
                                    onChange={(event) =>
                                        setColorPartido(event.target.value)
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="ImagenPartidoInput">
                                    Imagen <code>*</code>
                                </label>
                                <input
                                    type="file"
                                    className="form-control form-control-border"
                                    id="ImagenPartidoInput"
                                    accept=".pdf, .jpeg, .png, .jpg"
                                    onChange={handleFileChange}
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
                            {/* <button
                                className="btn btn-secondary"
                                onClick={() => setModalEliminacion(false)}
                            >
                                Cancelar
                            </button> */}
                            <button
                                className="btn btn-danger"
                                onClick={() => handleConfirmDelete()}
                            >
                                Eliminar
                            </button>
                        </>
                    }
                >
                    <p>
                        ¿Estás seguro de que quieres eliminar el partido
                        politico?
                    </p>
                </ModalCustom>
            </Authenticated>
        </>
    );
};

export default Index;
