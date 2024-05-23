import ContainerLTE from "@/Components/Generales/ContainerLTE";
import DataTablecustom from "@/Components/Generales/DataTable";
import ModalCustom from "@/Components/Generales/ModalCustom";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Index = (props) => {
    const [reloadData, setReloadData] = useState(false);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [modo, setModo] = useState("");

    /**Insert */
    /** Función para guardar un nuevo um */
    const saveNuevoUM = () => {
        if (modo === "Agregar") {
            agregarNuevoDistrito();
        } else if (modo === "Editar") {
            updateNuevoDistrito();
        }
    };

    const agregarNuevoDistrito = () => {
        const formData = new FormData();
        formData.append("nombre", nombre);
        axios
            .post(route("Distritos.Distritos.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    setReloadData(true);
                    setNombre("");
                    handleCloseModal();
                    Swal.fire({
                        title: "Distrito registrado correctamente",
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

    const updateNuevoDistrito = () => {
        const id = idDisSelect;

        axios
            .put(route(`Distritos.Distritos.update`, { id: id }), null, {
                params: {
                    descripcion: nombre,
                },
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    setReloadData(true);
                    handleCloseModal();
                    setidDisSelect(null)
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

    const handleConfirmDelete = () => {
        const id = idDisSelect;
        axios
        .delete(route(`Distritos.Distritos.destroy`, { id }))
        .then((response) => {
          if (response.status === 200) {
            setReloadData(true);
            Swal.fire({
                title: "Distrito eliminado correctamente",
                icon: "success",
                showConfirmButton: false,
                timer: 1600,
            });
            setModalOpen2(false);
          }
        })
        .catch((error) => {
          console.error("Error al eliminar el distrito:", error);
        });
         
    };
    /**Fin insert */

    const [data, setData] = useState([]);
    // Listado de Departamentos
    const getDistritos = async () => {
        try {
            const response = await axios.get(
                `${route("Distritos.Distritos.listarDistritos")}`
            );
            if (response.status === 200) {
                // Mapear los datos de respuesta para crear un nuevo arreglo de objetos
                const formattedData = response.data.map((distrtio) => ({
                    id: distrtio.id,
                    distrito: distrtio.descripcion,
                }));
                // Establecer los departamentos en el estado
                setData(formattedData);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getDistritos();
        return () => setReloadData(false);
    }, [reloadData]);
    /**Modals */

    const [modalOpen, setModalOpen] = useState(false);
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const [modalOpen2, setModalOpen2] = useState(false);

    /**Fin Modal */

    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
        },
        {
            name: "Nombre",
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

    const [idDisSelect, setidDisSelect] = useState(null)
    const handleEdit = (distrito) => {
        setModo("Editar");
        setidDisSelect(distrito.id)
        setNombre(distrito.distrito);
        setModalOpen(true);
    };

    const handleDelete = (idDetelete) => {
        setidDisSelect(idDetelete);
        setModalOpen2(true);
    };


    return (
        <>
            <Authenticated
              auth={props.auth}
              errors={props.errors}
            >
                <ContainerLTE
                    title={"Distritos"}
                    buttonadd={
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
                    }
                >
                    <DataTablecustom columnas={columns} datos={data} />
                </ContainerLTE>

                <ModalCustom
                    tamaño={"lg"}
                    title={modo === "Agregar" ? "Registrar distrito" : "Editar distrito"}
                    isOpen={modalOpen}
                    onClose={handleCloseModal}
                    btnfooter={
                        <button
                            className="btn btn-primary float-end"
                            onClick={saveNuevoUM}
                        >
                            <span className="fas fa-save" /> Guardar
                        </button>
                    }
                >
                    <div className="card-body">
                        <h4>Información del distrito</h4>
                        <br />
                        <form>
                            <div className="form-group">
                                <label htmlFor="nombreInput">
                                    Distrito <code>*</code>
                                </label>
                                <input
                                    type="text"
                                    className="form-control form-control-border"
                                    id="nombreInput"
                                    placeholder="Nombre"
                                    value={nombre}
                                    onChange={(event) =>
                                        setNombre(event.target.value)
                                    }
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
                                className="btn btn-danger"
                                onClick={() => handleConfirmDelete()}
                            >
                                Eliminar
                            </button>
                        </>
                    }
                >
                    <p>
                        ¿Estás seguro de que quieres eliminar este distito?
                    </p>
                </ModalCustom>
            </Authenticated>
        </>
    );
};

export default Index;
