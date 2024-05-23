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
    
    const [id_seccion, setIdSeccion] = useState("");
    const [tipoCasilla, setTipoCasilla] = useState("");
    const [listaNominal, setListaNominal] = useState("");
    const [votosNulos, setVotosNulos ] = useState("");
    const [votosTotales, setVotosTotales] = useState("");
    const [ubicacion, setUbicacion] = useState("");


    const [modalOpen, setModalOpen] = useState(false);

    const [CasillaSeleccionada, setCasillaSeleccionada] = useState(null);

    const [modalEliminacion, setModalEliminacion] = useState(false);
    const [idDetelete, setIdDetelete] = useState(null);

    const handleCloseModal = () => {
        setModalOpen(false);
    };


    const AgregarCasilla = () => {
        const formData = new FormData();
        formData.append("id_seccion", id_seccion);
        formData.append("tipoCasilla", tipoCasilla);
        formData.append("listaNominal", listaNominal);
        formData.append("votosNulos", votosNulos);
        formData.append("votosTotales", votosTotales);
        formData.append("ubicacion", ubicacion);

        axios
            .post(route("Casillas.Casillas.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    setReloadData(true);

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

    const CasillasDonde = () => {
        if (modo === "Agregar") {
            AgregarCasilla();
        } else if (modo === "Editar") {
            ActualizaCasilla();
        }
    };

    //listar Partidos Politicos
    const [dataCasilla, setdataCasilla] = useState([]);

    // Listado de partidos politicos
    const getCasillas = async () => {
        try {
            const response = await axios.get(
                `${route("Casillas.Casillas.listarCasillas")}`
            );
            if (response.status === 200) {
                console.log('response', response);
                // Mapear los datos de respuesta para crear un nuevo arreglo de objetos
                const formattedData = response.data.map((Casilla) => ({
                    id: Casilla.id,
                    id_seccion: Casilla.id_seccion,
                    tipoCasilla: Casilla.tipoCasilla,
                    listaNominal: Casilla.listaNominal,
                    votosNulos: Casilla.votosNulos,
                    votosTotales: Casilla.votosTotales,
                    ubicacion: Casilla.ubicacion,
                }));
                // Establecer los departamentos en el estado
                setdataCasilla(formattedData);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getCasillas();
    }, [reloadData]);

    const columns = [
        {
            name: "id_seccion",
            selector: (row) => row.id_seccion,
        },
       
        {
            name: "Tipo de Casilla",
            selector: (row) => row.tipoCasilla,
        },
        {
            name: "Lista Nominal",
            selector: (row) => row.listaNominal,
        },
        {
            name: "Votos Nulos",
            selector: (row) => row.votosNulos,
        },
       
        {
            name: "Votos Totales",
            selector: (row) => row.votosTotales,
        },
        {
            name: "Ubicación",
            selector: (row) => row.ubicacion,
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

    const handleEdit = (CasillaSeleccionada) => {
        setModo("Editar");
        setCasillaSeleccionada(CasillaSeleccionada);
        setModalOpen(true);
    };

    useEffect(() => {
        // Cuando se abre el modal de edición, establecer los valores de los inputs
        if (modo === "Editar" && CasillaSeleccionada) {
            setIdSeccion(CasillaSeleccionada.id_seccion);
            setTipoCasilla(CasillaSeleccionada.tipoCasilla);
            setListaNominal(CasillaSeleccionada.listaNominal);
          
        } else {
            setIdSeccion("");
            setTipoCasilla("");
            setListaNominal("");            
        }
    }, [modo, CasillaSeleccionada]);

    const ActualizaCasilla = () => {
        const id = CasillaSeleccionada?.id; // Obtener el ID del partido politico seleccionado

        axios
        .put(route(`Casillas.Casillas.update`, { id: id }), null, {
            params: {
                id_seccion: id_seccion,
                tipoCasilla: tipoCasilla,
                listaNominal: listaNominal,
                votosNulos: votosNulos,
                votosTotales: votosTotales,
                ubicacion: ubicacion,
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
        getCasillas();
        return () => setReloadData(false);
    }, [reloadData]);

    const handleDelete = (idDetelete) => {
        setIdDetelete(idDetelete);
        setModalEliminacion(true);
    };

    const handleConfirmDelete = () => {
        const id = idDetelete;
        axios
            .delete(route(`Casillas.Casillas.destroy`, { id }))
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
                console.error("Error al eliminar Casilla:", error);
            });
    };


    return (
        <>
            <Authenticated>
                <ContainerLTE
                    title="Casillas"
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
                    <DataTablecustom columnas={columns} datos={dataCasilla} />

                </ContainerLTE>
                <ModalCustom
                    tamaño={"lg"}
                    title={modo === "Agregar" ? "Agregar" : "Editar"}
                    isOpen={modalOpen}
                    onClose={handleCloseModal}
                    btnfooter={
                        <button
                            className="btn btn-primary float-end"
                            onClick={CasillasDonde}
                        >
                            <span className="fas fa-save" /> Guardar
                        </button>
                    }
                >
                    <div className="card-body">
                        <h4>Información de las Casillas</h4>
                        <br />
                        <form>
                            <div className="form-group">
                                <label htmlFor="id_seccionInput">
                                    id_seccion <code>*</code>
                                </label>
                                <input
                                    type="text"
                                    className="form-control form-control-border"
                                    id="id_seccionInput"
                                    placeholder="seccion"
                                    value={id_seccion}
                                    onChange={(event) =>
                                        setIdSeccion(event.target.value)
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="tipoCasillaInput">
                                    Tipo de Casilla <code>*</code>
                                </label>
                                <input
                                    type="text"
                                    className="form-control form-control-border"
                                    id="tipoCasillaInput"
                                    placeholder="tipo de casilla"
                                    value={tipoCasilla}
                                    onChange={(event) =>
                                        setTipoCasilla(event.target.value)
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
                                <label htmlFor="VotosNulosInput">
                                    Votos Nulos<code>*</code>
                                </label>
                                <input
                                    type="text"
                                    className="form-control form-control-border"
                                    id="VotosNulosInput"
                                    placeholder="votos nulos"
                                    value={votosNulos}
                                    onChange={(event) =>
                                        setVotosNulos(event.target.value)
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="VotosTotalesInput">
                                    Votos Totales<code>*</code>
                                </label>
                                <input
                                    type="text"
                                    className="form-control form-control-border"
                                    id="VotosTotalesInput"
                                    placeholder="votos totales"
                                    value={votosTotales}
                                    onChange={(event) =>
                                        setVotosTotales(event.target.value)
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="UbicacionInput">
                                    Ubicacion<code>*</code>
                                </label>
                                <input
                                    type="text"
                                    className="form-control form-control-border"
                                    id="UbicacionInput"
                                    placeholder="ubicacion"
                                    value={ubicacion}
                                    onChange={(event) =>
                                        setUbicacion(event.target.value)
                                    }
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
                    <p>¿Estás seguro de que quieres eliminar la casilla?</p>
                </ModalCustom>
            </Authenticated>
        </>
    );
};

export default Index;
