import ContainerLTE from "@/Components/Generales/ContainerLTE";
import DataTablecustom from "@/Components/Generales/DataTable";
import ModalCustom from "@/Components/Generales/ModalCustom";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import CustomSelect from "@/Components/Generales/CustomSelect";
import { Button, Col, Row, Tab, Table, Tabs } from "react-bootstrap";
import DynamicChart from "@/Components/Generales/Grafica";

const Index = (props) => {
    const [reloadData, setReloadData] = useState(false);
    const [nombre, setNombre] = useState("");
    const [distrito, setDistrito] = useState(null);
    const [seccion, setSeccion] = useState(null);
    const [casilla, setCasilla] = useState(null);
    const [eleccion, setEleccion] = useState(null);
    const [tipoEleccion, setTipoEleccion] = useState(null);
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

    const [dataResultadosEleccion, setDataResultadosEleccion] = useState([]);
    // Listado de Departamentos
    const getResultadosElecciones = async (tipo) => {
        try {
            const response = await axios.get(
                `${route("Resultados.Resultados.listarPorTipoEleccion", {
                    id_eleccion: tipo,
                })}`
            );
            if (response.status === 200) {
                // Mapear los datos de respuesta para crear un nuevo arreglo de objetos
                const formattedData = response.data.map((distrtio) => ({
                    id: distrtio.id,
                    id_casilla: distrtio.id_casilla,
                    id_partido: distrtio.id_partido,
                    id_coalicion: distrtio.id_coalicion,
                    id_eleccion: distrtio.id_eleccion,
                    total: distrtio.total,
                    nombrePartidoOCoal: distrtio.nombrePartido
                        ? distrtio.nombrePartido
                        : distrtio.nombreCoalicion,
                    abreviaturaPartido: distrtio.abreviaturaPartido,
                    colorPartido: distrtio.colorPartido,
                    seccionCons: distrtio.seccionCons,
                    descripcionSeccion: distrtio.descripcionSeccion,
                    tipoDeCasilla: distrtio.tipoDeCasilla,
                }));
                // Establecer los departamentos en el estado
                setDataResultadosEleccion(formattedData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (tipoEleccion) {
            getResultadosElecciones(tipoEleccion);
        }
    }, [tipoEleccion]);

    const [partidosOCoalicion, setPartidosOCoalicion] = useState([]);
    const [totalpartidosOCoalicion, setTotalPartidosOCoalicion] = useState([]);
    const [coloresGrafica, setColoresGrafica] = useState([]);

    const [dataFilter, setDataFilter] = useState([]);
    const [totalesVR, setTotalesVR] = useState(0);
    useEffect(() => {
        //console.log("dataResultadosEleccion", dataFilter);
        let totalVotos = 0;
        dataFilter.forEach((registro) => {
            totalVotos += registro.total;
        });
        setTotalesVR(totalVotos);
        let agrupado = dataFilter.reduce((acumulador, item) => {
            let nombre = item.nombrePartidoOCoal;
            if (!acumulador[nombre]) {
                acumulador[nombre] = { ...item, total: 0 }; // copia todas las propiedades del item actual
            }
            acumulador[nombre].total += item.total;
            return acumulador;
        }, {});

        // Convertir el objeto a un arreglo
        let resultadoFinal = Object.values(agrupado);

        //console.log("----------------->", resultadoFinal);

        let ppOCoal = resultadoFinal.map((item) => item.nombrePartidoOCoal);
        setPartidosOCoalicion(ppOCoal);
        let totalppOCoal = resultadoFinal.map((item) => item.total);
        setTotalPartidosOCoalicion(totalppOCoal);
        let colores = resultadoFinal.map((item) => item.colorPartido);
        setColoresGrafica(colores);
    }, [dataFilter]);

    const [dataElecciones, setDataElecciones] = useState([]);
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
                    eleccion: distrtio.nombreEleccion,
                }));
                // Establecer los departamentos en el estado
                setDataElecciones(formattedData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getElecciones();
    }, []);

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
        getDistritos();
    }, []);

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
            if (response.status === 200) {
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
        if (casilla) {
            getCoaliciones(eleccion);
        }
    }, [casilla, eleccion]);

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
            name: "PARTIDO POLITICO O COALICION",
            selector: (row) => row.nombrePartidoOCoal,
        },
        {
            name: "SECCIÓN",
            selector: (row) => row.descripcionSeccion,
        },
        {
            name: "TIPO DE CASILLA",
            selector: (row) => row.tipoDeCasilla,
        },
        {
            name: "TOTAL DE VOTOS",
            selector: (row) => row.total,
        },
        /*{
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
        },*/
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

    const handleSelectChangeTipoEleccion = (selectedValue2) => {
        const selectedAccount = selectedValue2;
        setTipoEleccion(selectedAccount);
    };

    const handleSelectChangeEleccion = (selectedValue2) => {
        const selectedAccount = selectedValue2;
        setEleccion(selectedAccount);
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

    /***************************************************************************** */

    const [disSelectFil, setDisSelectFil] = useState(null);

    const handleSelectChangeDistritoFil = (selectedValue2) => {
        const selectedAccount = selectedValue2;
        setDisSelectFil(selectedAccount);
    };

    useEffect(() => {
        if (disSelectFil) {
            getSeccion(disSelectFil);
        }
    }, [disSelectFil]);

    const [seccionSelectFil, setSeccionSelectFil] = useState(null);

    const handleSelectChangeSeccionFil = (selectedValue2) => {
        const selectedAccount = selectedValue2;
        setSeccionSelectFil(selectedAccount);
    };

    const [dataCasillasFil, setDataCasillasFil] = useState([]);
    // Listado de Departamentos
    const getCasillasFil = async (id) => {
        try {
            const response = await axios.get(
                `${route("Casillas.Casillas.listarCasillaPorSeccionGral", {
                    id_seccion: id,
                })}`
            );
            if (response.status === 200) {
                // Mapear los datos de respuesta para crear un nuevo arreglo de objetos
                const formattedData = response.data.map((casilla) => ({
                    id: casilla.id,
                    tipoCasilla: casilla.tipoCasilla,
                    descripcion: casilla.descripcion,
                    listaNominal: casilla.listaNominal,
                    status: casilla.status,
                }));
                // Establecer los departamentos en el estado
                setDataCasillasFil(formattedData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (seccionSelectFil) {
            getCasillasFil(seccionSelectFil);
            const filter = dataResultadosEleccion.filter(
                (data) => data.seccionCons === seccionSelectFil
            );
            setDataFilter(filter);
        } else {
            setDataFilter(dataResultadosEleccion);
        }
    }, [seccionSelectFil, dataResultadosEleccion]);

    const [casillaSelectFil, setCasillaSelectFil] = useState(null);

    const handleSelectChangeCasillaFil = (selectedValue2) => {
        const selectedAccount = selectedValue2;
        setCasillaSelectFil(selectedAccount);
    };

    useEffect(() => {
        //console.log("first", dataResultadosEleccion);
        if (casillaSelectFil) {
            const filter = dataResultadosEleccion.filter(
                (data) => data.id_casilla === casillaSelectFil
            );
            setDataFilter(filter);
        } else {
            setDataFilter(dataResultadosEleccion);
        }
    }, [dataResultadosEleccion, casillaSelectFil]);

    /***************************************************************************** */

    const [dataArray, setDataArray] = useState([]);

    const handleAddToDataArray = () => {
        setDataArray([])
        const newDataArray = [];
    
        // Validación para inputs
        for (let i = 0; i < inputs.length; i++) {
            const parsedInput = parseInt(inputs[i]);
            if (isNaN(parsedInput) || parsedInput < 0) {
                alert("No puede haber números negativos en inputs");
                return; // Salir de la función sin construir el arreglo
            }
            newDataArray.push({
                id_partido: dataPartidosPoliticos[i].id,
                total: parsedInput,
                id_casilla: casilla,
                id_eleccion: eleccion,
                id_coalicion: 0,
                id_distrito: distrito,
            });
        }
    
        // Validación para inputsCoa
        for (let i = 0; i < inputsCoa.length; i++) {
            const parsedInputCoa = parseInt(inputsCoa[i]);
            if (isNaN(parsedInputCoa) || parsedInputCoa < 0) {
                alert("No puede haber números negativos en inputsCoa");
                return; // Salir de la función sin construir el arreglo
            }
            newDataArray.push({
                id_partido: 0,
                total: parsedInputCoa,
                id_casilla: casilla,
                id_eleccion: eleccion,
                id_coalicion: dataCoaliciones[i].id,
                id_distrito: distrito,
            });
        }
    
        setDataArray((prevDataArray) => [...prevDataArray, ...newDataArray]);
    };
    
/*
    useEffect(() => {
        console.log("dataArray", dataArray);
    }, [dataArray]);
*/
    const registrarTotales = () => {
        const formData = new FormData();
        const totales = dataArray;
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

    const cellStyles = {
        backgroundColor: "#343a40",
        color: "#fff",
        fontWeight: "bold",
    };

    const cellStyles2 = {
        backgroundColor: "#f3f3f3",
        fontWeight: "bold",
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
                    <div className="form-group">
                        <label htmlFor="nombreInput">
                            Selecciona el tipo de elección: <code>*</code>
                        </label>
                        <CustomSelect
                            dataOptions={dataElecciones.map((role) => ({
                                value: role.id,
                                label: role.eleccion,
                            }))}
                            preDefaultValue={tipoEleccion}
                            setValue={handleSelectChangeTipoEleccion}
                            useFilter={true}
                        />
                    </div>
                    <Row>
                        <Col>
                            <label htmlFor="nombreInput">
                                Selecciona un distrito: <code>*</code>
                            </label>
                            <CustomSelect
                                dataOptions={dataDist.map((role) => ({
                                    value: role.id,
                                    label: role.distrito,
                                }))}
                                preDefaultValue={disSelectFil}
                                setValue={handleSelectChangeDistritoFil}
                            />
                        </Col>
                        <Col>
                            <label htmlFor="nombreInput">
                                Selecciona una sección: <code>*</code>
                            </label>
                            <CustomSelect
                                dataOptions={dataSeccion.map((role) => ({
                                    value: role.id,
                                    label: role.descripcion,
                                }))}
                                preDefaultValue={seccionSelectFil}
                                setValue={handleSelectChangeSeccionFil}
                            />
                        </Col>
                        <Col>
                            <label htmlFor="nombreInput">
                                Selecciona una casilla: <code>*</code>
                            </label>
                            <CustomSelect
                                dataOptions={dataCasillasFil.map((casilla) => ({
                                    value: casilla.id,
                                    label:
                                        casilla.descripcion +
                                        "-" +
                                        casilla.tipoCasilla +
                                        (casilla.status == 1 ? " ✅" : " ❌"),
                                }))}
                                preDefaultValue={casillaSelectFil}
                                setValue={handleSelectChangeCasillaFil}
                            />
                        </Col>
                    </Row>
                    <Tabs
                        defaultActiveKey="home"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                        justify
                        style={{
                            fontSize: "larger",
                            fontWeight: "bold",
                            marginTop: "1%",
                        }}
                    >
                        <Tab
                            eventKey="home"
                            title={
                                <span style={{ textTransform: "capitalize" }}>
                                    <span className="fas fa-table" /> Tabla
                                </span>
                            }
                        >
                            <>
                                <DataTablecustom
                                    columnas={columns}
                                    datos={dataFilter}
                                />
                                <Row className="mt-2 mt-md-2 mt-lg-2">
                                    <Col md={{ span: 4, offset: 8 }}>
                                        <Table>
                                            <tbody>
                                                <tr>
                                                    <td style={cellStyles}>
                                                        Total de votos
                                                        registrados
                                                    </td>
                                                    <td style={cellStyles2}>
                                                        {totalesVR}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </>
                        </Tab>
                        <Tab
                            eventKey="profile"
                            title={
                                <span style={{ textTransform: "capitalize" }}>
                                    <span className="fas fa-chart-line" />{" "}
                                    Gráfico
                                </span>
                            }
                        >
                            <div style={{ maxHeight: "60vh" }}>
                                {dataResultadosEleccion.length > 0 ? (
                                    <DynamicChart
                                        frecuencias={totalpartidosOCoalicion}
                                        etiquetas={partidosOCoalicion}
                                        chartType={"bar"}
                                        titInfo={"Total de votos"}
                                        bgColor={coloresGrafica}
                                        chartTitle={
                                            "TOTALES DE VOTOS PARA PARTIDOS POLITICOS Y COALICIONES"
                                        }
                                        alto={"500px"}
                                    />
                                ) : (
                                    <p>Cargando...</p>
                                )}
                            </div>
                        </Tab>
                    </Tabs>
                </ContainerLTE>

                <ModalCustom
                    tamaño={"xl"}
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
                                    dataOptions={dataElecciones.map((role) => ({
                                        value: role.id,
                                        label: role.eleccion,
                                    }))}
                                    preDefaultValue={eleccion}
                                    setValue={handleSelectChangeEleccion}
                                    useFilter={true}
                                />
                            </div>
                            <Row>
                                <Col>
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
                                </Col>
                                <Col>
                                    <label htmlFor="nombreInput">
                                        Selecciona una sección: <code>*</code>
                                    </label>
                                    <CustomSelect
                                        dataOptions={dataSeccion.map(
                                            (role) => ({
                                                value: role.id,
                                                label: role.descripcion,
                                            })
                                        )}
                                        preDefaultValue={seccion}
                                        setValue={handleSelectChangeSeccion}
                                    />
                                </Col>
                                <Col>
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
                                </Col>
                            </Row>
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
                                                    placeholder="Votos"
                                                    className="form-control form-control-border"
                                                    value={inputs[index]}
                                                    min={0}
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
                                                <label
                                                    style={{
                                                        textTransform:
                                                            "capitalize",
                                                    }}
                                                >
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
                                                placeholder="Votos"
                                                className="form-control form-control-border mt-2"
                                                min={0}
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
