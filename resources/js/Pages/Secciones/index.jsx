import ContainerLTE from "@/Components/Generales/ContainerLTE";
import ModalCustom from "@/Components/Generales/ModalCustom";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import DataTablecustom from "@/Components/Generales/DataTable";

const Index = () => {
    const [modo, setModo] = useState("");
    const [reloadData, setReloadData] = useState(false);
    const [descripcion, setDescripcion] = useState("");
    const [idDistrito, setIdDistrito] = useState("");
    const [unidadMedidaSeleccionada, setUnidadMedidaSeleccionada] = useState(null);
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
                console.log('response', response);
                // Mapear los datos de respuesta para crear un nuevo arreglo de objetos
                const formattedData = response.data.map((unimedida) => ({
                    id: unimedida.id,
                    descripcion: unimedida.descripcion,
                    distrito: unimedida.id_distrito,
                   
                }));
                // Establecer los departamentos en el estado
                setData(formattedData);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getSecciones();
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
          
        } else {
            // Si no estamos en modo de edición, resetear los valores de los inputs
            setDescripcion("");
            setIdDistrito("");
            
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
        console.log('clic'+idDetelete);
        setidDetelete(idDetelete); // Pasar la unidad de medida seleccionada
        setModalOpen2(true);
        // Lógica para llenar el formulario con los datos de la unidad de medida a editar
    };

    return (
        <>
            <Authenticated>
                <ContainerLTE
                    title="Secciones"
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
                    <DataTablecustom columnas={columns} datos={data}/>
                    
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
                                <label htmlFor="idDistritoInput">
                                    ID de Distrito <code>*</code>
                                </label>
                                <input
                                    type="number"
                                    className="form-control form-control-border"
                                    id="idDistritoInput"
                                    placeholder="ID de Distrito"
                                    value={idDistrito}
                                    onChange={(event) =>
                                        setIdDistrito(event.target.value)
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
                    <p>
                        ¿Estás seguro de que quieres eliminar esta seccion?
                    </p>
                </ModalCustom>
            </Authenticated>
        </>
    );
};

export default Index;
