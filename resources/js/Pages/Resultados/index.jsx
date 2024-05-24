import ContainerLTE from "@/Components/Generales/ContainerLTE";
import DataTablecustom from "@/Components/Generales/DataTable";
import ModalCustom from "@/Components/Generales/ModalCustom";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import CustomSelect from "@/Components/Generales/CustomSelect";
import { Button, Col, Row } from "react-bootstrap";

const Index = (props) => {
    const [reloadData, setReloadData] = useState(false);
    const [nombre, setNombre] = useState("");
    const [distrito, setDistrito] = useState(null);
    const [seccion, setSeccion] = useState(null);
    const [casilla, setCasilla] = useState(null);
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
                    setidDisSelect(null);
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

    const [dataDist, setDataDist] = useState([]);
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
                setDataDist(formattedData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (modo == "Agregar") {
            getDistritos();
        }
    }, [modo]);

    const [dataSeccion, setDataSeccion] = useState([]);
    // Listado de Departamentos
    const getSeccion = async (id) => {
        try {
            const response = await axios.get(
                `${route("Secciones.Secciones.listarSeccionDistrito", {
                    id_distrito: id,
                })}`
            );
            if (response.status === 200) {
                // Mapear los datos de respuesta para crear un nuevo arreglo de objetos
                const formattedData = response.data.map((seccion) => ({
                    id: seccion.id,
                    descripcion: seccion.descripcion,
                }));
                // Establecer los departamentos en el estado
                setDataSeccion(formattedData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (distrito) {
            getSeccion(distrito);
        }
    }, [distrito]);

    const [dataCasillas, setDataCasillas] = useState([]);
    // Listado de Departamentos
    const getCasillas = async (id) => {
        try {
            const response = await axios.get(
                `${route("Casillas.Casillas.listarCasillaPorSeccion", {
                    id_seccion: id,
                })}`
            );
            console.log(response);
            if (response.status === 200) {
                // Mapear los datos de respuesta para crear un nuevo arreglo de objetos
                const formattedData = response.data.map((casilla) => ({
                    id: casilla.id,
                    tipoCasilla: casilla.tipoCasilla,
                    descripcion: casilla.descripcion,
                    listaNominal: casilla.listaNominal,
                }));
                // Establecer los departamentos en el estado
                setDataCasillas(formattedData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (seccion) {
            getCasillas(seccion);
        }
    }, [seccion]);

    const [dataPartidosPoliticos, setDataPartidosPoliticos] = useState([]);

    // Listado de partidos politicos
    const getPartidosPoliticos = async () => {
        try {
            const response = await axios.get(
                `${route("PartidosPoliticos.PartidosPoliticos.listarPartidos")}`
            );
            if (response.status === 200) {
                // Mapear los datos de respuesta para crear un nuevo arreglo de objetos
                const formattedData = response.data.map((PartidoPolitico) => ({
                    id: PartidoPolitico.id,
                    nombrePartido: PartidoPolitico.nombrePartido,
                    abreviatura: PartidoPolitico.abrebiatura,
                    color: PartidoPolitico.color,
                }));
                // Establecer los departamentos en el estado
                setDataPartidosPoliticos(formattedData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (casilla) {
            getPartidosPoliticos();
        }
    }, [casilla]);

    const [dataCoaliciones, setDataCoaliciones] = useState([]);

    // Listado de partidos politicos
    const getCoaliciones = async (id) => {
        try {
            const response = await axios.get(
                `${route("Coaliciones.Coaliciones.listarCoalicionesPartidos", {
                    id_eleccion: id,
                })}`
            );
            console.log("response", response);
            if (response.status === 200) {
                console.log("response", response);
                // Mapear los datos de respuesta para crear un nuevo arreglo de objetos
                const formattedData = response.data.map((coalicion) => ({
                    id: coalicion.id,
                    descripcion: coalicion.descripcion,
                    id_eleccion: coalicion.id_eleccion,
                    abreviaturas: coalicion.abreviaturas,
                    colores: coalicion.colores.split(","),
                }));
                // Establecer los departamentos en el estado
                setDataCoaliciones(formattedData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const tipoEleccion = 1;
        if (casilla) {
            getCoaliciones(tipoEleccion);
        }
    }, [casilla]);

    const [inputs, setInputs] = useState(dataPartidosPoliticos.map(() => ""));

    const handleInputChange = (index, value) => {
        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);
    };

    const [inputsCoa, setInputsCoa] = useState(dataCoaliciones.map(() => ""));

    const handleInputChangeCoal = (index, value) => {
        const newInputsCoa = [...inputsCoa];
        newInputsCoa[index] = value;
        setInputsCoa(newInputsCoa);
    };

    useEffect(() => {
        console.log("inputsCoa", inputsCoa);
    }, [inputsCoa]);

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

    const [idDisSelect, setidDisSelect] = useState(null);
    const handleEdit = (distrito) => {
        setModo("Editar");
        setidDisSelect(distrito.id);
        setNombre(distrito.distrito);
        setModalOpen(true);
    };

    const handleDelete = (idDetelete) => {
        setidDisSelect(idDetelete);
        setModalOpen2(true);
    };

    const handleSelectChangeDistrito = (selectedValue2) => {
        const selectedAccount = selectedValue2;
        setDistrito(selectedAccount);
    };

    const handleSelectChangeSeccion = (selectedValue2) => {
        const selectedAccount = selectedValue2;
        setSeccion(selectedAccount);
    };

    const handleSelectChangeCasilla = (selectedValue2) => {
        const selectedAccount = selectedValue2;
        setCasilla(selectedAccount);
    };

    const [dataArray, setDataArray] = useState([]);

    const handleAddToDataArray = () => {
        setDataArray([]);
        setDataArray((prevDataArray) => [
            ...prevDataArray,
            ...inputs.map((input, index) => ({
                id_partido: dataPartidosPoliticos[index].id,
                total: parseInt(input),
                id_casilla: casilla,
                id_eleccion: 1,
                id_coalicion: 0,
            })),
            ...inputsCoa.map((inputCoa, index) => ({
                id_partido: 0,
                total: parseInt(inputCoa),
                id_casilla: casilla,
                id_eleccion: 1,
                id_coalicion: dataCoaliciones[index].id,
            })),
        ]);
    };

    useEffect(() => {
        console.log("dataArray", dataArray);
    }, [dataArray]);

    const registrarTotales = () => {
        const formData = new FormData();
        const totales = dataArray;
        console.log("Tot------->", totales);
        totales.forEach((total, index) => {
            Object.keys(total).forEach((key) => {
                formData.append(`totales[${index}][${key}]`, total[key]);
            });
        });

        axios
            .post(route("Resultados.Resultados.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    setReloadData(true);
                    handleCloseModal();
                    Swal.fire({
                        title: "Agregado correctamente",
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

    return (
        <>
            <Authenticated auth={props.auth} errors={props.errors}>
                <ContainerLTE
                    title={"Resultados"}
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
                    <DataTablecustom columnas={columns} datos={[]} />
                </ContainerLTE>

                <ModalCustom
                    tamaño={"lg"}
                    title={
                        modo === "Agregar"
                            ? "Registrar resultados"
                            : "Editar distrito"
                    }
                    isOpen={modalOpen}
                    onClose={handleCloseModal}
                    btnfooter={
                        dataArray.length > 0 && (
                            <button
                                className="btn btn-primary float-end"
                                onClick={registrarTotales}
                            >
                                <span className="fas fa-save" /> Guardar
                            </button>
                        )
                    }
                >
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="nombreInput">
                                    Tipo de elección: <code>*</code>
                                </label>
                                <CustomSelect
                                    dataOptions={dataDist.map((role) => ({
                                        value: role.id,
                                        label: role.distrito,
                                    }))}
                                    preDefaultValue={distrito}
                                    setValue={handleSelectChangeDistrito}
                                    useFilter={true}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="nombreInput">
                                    Selecciona un distrito: <code>*</code>
                                </label>
                                <CustomSelect
                                    dataOptions={dataDist.map((role) => ({
                                        value: role.id,
                                        label: role.distrito,
                                    }))}
                                    preDefaultValue={distrito}
                                    setValue={handleSelectChangeDistrito}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="nombreInput">
                                    Selecciona una sección: <code>*</code>
                                </label>
                                <CustomSelect
                                    dataOptions={dataSeccion.map((role) => ({
                                        value: role.id,
                                        label: role.descripcion,
                                    }))}
                                    preDefaultValue={seccion}
                                    setValue={handleSelectChangeSeccion}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="nombreInput">
                                    Selecciona una casilla: <code>*</code>
                                </label>
                                <CustomSelect
                                    dataOptions={dataCasillas.map(
                                        (casilla) => ({
                                            value: casilla.id,
                                            label:
                                                casilla.descripcion +
                                                "-" +
                                                casilla.tipoCasilla,
                                        })
                                    )}
                                    preDefaultValue={casilla}
                                    setValue={handleSelectChangeCasilla}
                                />
                            </div>
                            <h3
                                className="mt-3"
                                style={{
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                PARTIDOS POLÍTICOS
                            </h3>
                            <hr />
                            <div>
                                <Row className="mt-3">
                                    {dataPartidosPoliticos.map(
                                        (partido, index) => (
                                            <Col key={partido.id}>
                                                <div className="d-flex justify-content-center">
                                                    <label>
                                                        {partido.abreviatura}
                                                    </label>
                                                    <div
                                                        className="ml-2"
                                                        style={{
                                                            backgroundColor:
                                                                partido.color,
                                                            width: "20px",
                                                            height: "20px",
                                                            borderRadius: "50%",
                                                        }}
                                                    ></div>
                                                </div>
                                                <input
                                                    type="number"
                                                    placeholder="Cantidad de votos"
                                                    className="form-control form-control-border"
                                                    value={inputs[index]}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            index,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </Col>
                                        )
                                    )}
                                </Row>
                            </div>
                            <h3
                                className="mt-4"
                                style={{
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                COALICIONES
                            </h3>
                            <hr />
                            <div>
                                <Row className="mt-3">
                                    {dataCoaliciones.map((coalicion, index) => (
                                        <Col key={coalicion.id}>
                                            <div
                                                className="d-flex justify-content-center"
                                                style={{
                                                    flexDirection: "column",
                                                }}
                                            >
                                                <label>
                                                    {coalicion.descripcion}
                                                </label>
                                                <label>
                                                    {coalicion.abreviaturas}
                                                </label>
                                                <div className="d-flex">
                                                    {coalicion.colores.map(
                                                        (color) => (
                                                            <div
                                                                style={{
                                                                    backgroundColor:
                                                                        color,
                                                                    width: "20px",
                                                                    height: "20px",
                                                                    borderRadius:
                                                                        "50%",
                                                                    marginLeft:
                                                                        "2px",
                                                                }}
                                                            ></div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                            <input
                                                type="number"
                                                placeholder="Cantidad de votos"
                                                className="form-control form-control-border mt-2"
                                                value={inputsCoa[index]}
                                                onChange={(e) =>
                                                    handleInputChangeCoal(
                                                        index,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        </form>
                        <div>
                            <Button onClick={handleAddToDataArray}>
                                Guardar cambios
                            </Button>
                        </div>
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
                    <p>¿Estás seguro de que quieres eliminar este distito?</p>
                </ModalCustom>
            </Authenticated>
        </>
    );
};

export default Index;
