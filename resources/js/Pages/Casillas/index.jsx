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

    const [id_seccion, setIdSeccion] = useState(0);
    console.log("first", id_seccion);
    const [tipoCasilla, setTipoCasilla] = useState("");

    const [votosNulos, setVotosNulos] = useState("");

    const [votosTotales, setVotosTotales] = useState("");
    const [ubicacion, setUbicacion] = useState("");

    const [modalOpen, setModalOpen] = useState(false);

    const [CasillaSeleccionada, setCasillaSeleccionada] = useState(null);

    const [modalEliminacion, setModalEliminacion] = useState(false);
    const [modalIlegile, setModalIlegible] = useState(false);
    const [idDetelete, setIdDetelete] = useState(null);

    const [ilegible, setIlegible] = useState("");

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const AgregarCasilla = () => {
        const formData = new FormData();
        formData.append("id_seccion", id_seccion);

        formData.append("tipoCasilla", tipoCasilla);

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
                    setIdSeccion("");
                    setTipoCasilla("");

                    setVotosNulos("");
                    setVotosTotales("");
                    setUbicacion("");
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
                console.log("casillas", response);
                // Mapear los datos de respuesta para crear un nuevo arreglo de objetos
                const formattedData = response.data.map((Casilla) => ({
                    id: Casilla.id,
                    seccion: Casilla.descripcion,
                    id_seccion: Casilla.id_seccion,
                    tipoCasilla: Casilla.tipoCasilla,
                    status: Casilla.status,
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
    const [dataSeccion, setDataSeccion] = useState([]);
    // Listado de Departamentos
    const getSecciones = async () => {
        try {
            const response = await axios.get(
                `${route("Secciones.Secciones.listarSecciones")}`
            );
            if (response.status === 200) {
                console.log("Secciones", response);
                // Mapear los datos de respuesta para crear un nuevo arreglo de objetos
                const formattedData = response.data.map((unimedida) => ({
                    id: unimedida.id,
                    value: unimedida.descripcion,
                }));
                // Establecer los departamentos en el estado
                setDataSeccion(formattedData);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getCasillas();
        getSecciones();
    }, [reloadData]);

    const columns = [
        {
            name: "Seccion",
            selector: (row) => row.seccion,
        },

        {
            name: "Tipo de Casilla",
            selector: (row) => row.tipoCasilla,
        },
        {
            name: "Estado",
            selector: (row) => (
                <>
                    <div>
                        <div
                            style={{
                                height: "30px",
                                width: "30px",
                                backgroundColor:
                                    row.status === 0
                                        ? "red"
                                        : row.status === 1
                                        ? "green"
                                        : row.status === 2
                                        ? "orange"
                                        : "white", // Si el estado es 2, el color será anaranjado. Si no es ninguno de los anteriores, será blanco.
                                borderRadius: "50%",
                            }}
                        />
                    </div>
                </>
            ),
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
                        className="btn btn-info btn-xs"
                        onClick={() => Statusup(row.id)}
                    >
                        <span className="fas fa-eye-slash"></span> Ilegible
                    </button>
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
            setIlegible(CasillaSeleccionada.status);
            setUbicacion(CasillaSeleccionada.ubicacion);
        } else {
            setIdSeccion("");
            setTipoCasilla("");
            setIlegible("");
            setVotosNulos("");
            setVotosTotales("");
            setUbicacion("");
        }
    }, [modo, CasillaSeleccionada]);

    const ActualizaCasilla = () => {
        const id = CasillaSeleccionada?.id; // Obtener el ID del partido politico seleccionado

        axios
            .put(route(`Casillas.Casillas.update`, { id: id }), null, {
                params: {
                    id_seccion: id_seccion,
                    tipoCasilla: tipoCasilla,

                    votosNulos: votosNulos,
                    votosTotales: votosTotales,
                    ubicacion: ubicacion,
                    status: ilegible,
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
    const Statusup = (idDetelete) => {
        setIlegible(idDetelete);
        setModalIlegible(true);
    };

    const handleConfitupdateStatus = () => {
        const id = ilegible;
        axios
            .put(route(`Casillas.Casillas.updateStatusToTwo`, { id }))
            .then((response) => {
                if (response.status === 200) {
                    setReloadData(true);
                    Swal.fire({
                        title: "Actualizada a Ilegible correctamente",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1600,
                    });
                    setModalIlegible(false);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
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

    const handleSelectChange = (event) => {
        setIdSeccion(event);
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
            .post(route("Casillas.Casillas.storeFromCSV"), formData, {
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
                            <span className="fas fa-file-csv" /> Subir CSV
                        </button>
                        {uploadProgress > 0 && (
                            <div>
                                <p>Progreso de carga: {uploadProgress}%</p>
                                <progress value={uploadProgress} max="100" />
                            </div>
                        )}
                    </div>
                    <hr className="m-3" />
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
                                    Seccion <code>*</code>
                                </label>
                                <CustomSelect
                                    dataOptions={dataSeccion.map((role) => ({
                                        value: `${role.id} `,
                                        label: `${role.value}`,
                                    }))}
                                    preDefaultValue={dataSeccion.find(
                                        (role) =>
                                            role.id.toString() ===
                                            id_seccion.toString()
                                    )}
                                    setValue={handleSelectChange}
                                    //isDisabled={depFiltro}
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
                                {/** <label htmlFor="VotosNulosInput">
                                    Votos Nulos<code>*</code>
                                </label>*/}
                                <input
                                    type="hidden"
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
                                {/**
                                <label htmlFor="VotosTotalesInput">
                                    Votos Totales<code>*</code>
                                </label> */}
                                <input
                                    type="hidden"
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
                                <textarea
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

                <ModalCustom
                    isOpen={modalIlegile}
                    onClose={() => setModalIlegible(false)}
                    title=""
                    btnfooter={
                        <>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleConfitupdateStatus()}
                            >
                                Actualizar
                            </button>
                        </>
                    }
                >
                    <p>
                        ¿Estás seguro de que quieres poner como ilegible el
                        acta?
                    </p>
                </ModalCustom>
            </Authenticated>
        </>
    );
};

export default Index;
