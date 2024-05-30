import CustomSelect from "@/Components/Generales/CustomSelect";
import DynamicChart from "@/Components/Generales/Grafica";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Col, Row, Spinner, Tab, Table, Tabs, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import ContainerLTE from "@/Components/Generales/ContainerLTE";
import DataTablecustom from "@/Components/Generales/DataTable";

export default function Dashboard({ auth }) {
    const [distrito, setDistrito] = useState(null);
    const [dataDist, setDataDist] = useState([]);
    
    const [totalVotantes, setTotalVotantes]= useState([]);
    
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
                    total: distrtio.votosTotales,
                    avance: distrtio.avanceVotos,
                }));
                // Establecer los departamentos en el estado
                setDataDist(formattedData);
                setTotalVotantes(response.data[0].votosTotales);
                
            }
        } catch (error) {
            console.log(error);
        }
    };

    //listar total de casillas
    const [graficaTot, setGraficaTot] = useState([]);
    // console.log('graficaTot', totalCasillas)
    const [porcentajes, setPorcentajes] = useState([]);
    const [casillasData, setCasillasData] = useState({
        totalCasillas: 0,
        avanceCasillas: 0,
    }); // Añadido este estado
    const actasCapturadas = casillasData.avanceCasillas;
    const TotalactasaCapturadas = casillasData.totalCasillas;
    const actasFaltantes =
        casillasData.totalCasillas - casillasData.avanceCasillas;
    const getTotalCasillas = async () => {
        try {
            const response = await axios.get(
                `${route("Casillas.Casillas.countCasillas")}`
            );
            if (response.status === 200) {
                
                //setTotalCasillas(response);
                // Acceder a las propiedades `totalCasillas` y `avanceCasillas`
                const { totalCasillas, avanceCasillas } = response.data;
                setCasillasData({ totalCasillas, avanceCasillas });
                const porcentajeAvance = (
                    (avanceCasillas * 100) /
                    totalCasillas
                ).toFixed(2);
                const porcentajeFaltante = 100 - parseFloat(porcentajeAvance);

                setGraficaTot([
                    parseFloat(porcentajeAvance),
                    porcentajeFaltante,
                ]);
                setPorcentajes(["Avance", "Faltante"]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    //total de votos

    const [TotalVotos, setTotalVotos] = useState("");
    const [TotalVotosNulos, setTotalVotosNulos] = useState("");
    const [TotalVotosNoNulos, setTotalVotosNoNuloss] = useState("");

    console.log(
        "total de votos",
        TotalVotos,
        TotalVotosNulos,
        TotalVotosNoNulos
    );
    // Listado de Departamentos
    const getTotalVotos = async () => {
        try {
            const response = await axios.get(
                `${route("Resultados.Resultados.TotaldeVotos", {
                    id_eleccion: 1,
                })}`
            );
            if (response.status === 200) {
                // Mapear los datos de respuesta para crear un nuevo arreglo de objetos
                const formattedData = response.data.map((distrito) => ({
                    total: distrito.totalVotos,
                    nulos: distrito.votosNulos,
                }));

                let total = parseInt(
                    formattedData.reduce(
                        (sum, distrito) => sum + distrito.total,
                        0
                    )
                );
                let nulos = parseInt(
                    formattedData.reduce(
                        (sum, distrito) => sum + distrito.nulos,
                        0
                    )
                );
                // Calcular el total de votos, los votos nulos y el total de votos menos votos nulos
                setTotalVotos(total);
                setTotalVotosNulos(nulos);
                const totalVotosMenosNulos = total - nulos;
                setTotalVotosNoNuloss(totalVotosMenosNulos);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getTotalVotos();
        getTotalCasillas();
        getDistritos();
    }, []);

    const handleSelectChangeDistrito = (selectedValue2) => {
        const selectedAccount = selectedValue2;
        setDistrito(selectedAccount);
    };

    const [totalLista, setTotalLista] = useState(0);
    const [totalAvance, setTotalAvance] = useState(0);
    const [porcentaje, setPorcentaje] = useState(0);
    const [datosGraph, setDatosGraph] = useState([]);
    
    const [etiquetasGraph, setEtiquetasGraph] = useState([]);
    useEffect(() => {
        if (distrito) {
            const valueDist = distrito.split("|");
            setTotalLista(valueDist[1]);
            setTotalAvance(valueDist[2]);
            let porc = (
                (parseFloat(valueDist[2]) * 100) /
                parseFloat(valueDist[1])
            ).toFixed(2);
            let porcResto = 100 - porc;
            const datosGr = [parseFloat(porc), porcResto];
            const etiquetasGr = ["Avance", "Faltante"];
            setEtiquetasGraph(etiquetasGr);
            setDatosGraph(datosGr);
            setPorcentaje(porc);
        }
    }, [distrito]);

    const handleConfirmDelete = () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción reiniciará la base de datos y no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, reiniciar!",
            cancelButtonText: "No, cancelar!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(route("Elecciones.Elecciones.resetDatabase"))
                    .then((response) => {
                        if (response.status === 200) {
                            console.log("first", response.data.message);
                            Swal.fire({
                                title: response.data.message,
                                icon: "success",
                                showConfirmButton: false,
                                timer: 1600,
                            });
                        }
                    })
                    .catch((error) => {
                        console.error("Error al eliminar el eleccion:", error);
                    });
            }
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

    //tabla
    const [reloadData, setReloadData] = useState(false);
    const [nombre, setNombre] = useState("");
    //const [distrito, setDistrito] = useState(null);
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
                    imagenPartido: distrtio.imagenPartido,
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
    

    const [dataAgrupadaVotos, setDataAgrupadaVotos] = useState([]);
    console.log("first", dataAgrupadaVotos);
    const getResultadosEleccionesagrupado = async (tipo) => {
        
        try {
            const response = await axios.get(
                `${route("Resultados.Resultados.listarPorTipoEleccion", {
                    id_eleccion: tipo,
                })}`
            );
            if (response.status === 200) {
                console.log('votos capturados', response)
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
                    imagenPartido: distrtio.imagenPartido,
                    seccionCons: distrtio.seccionCons,
                    descripcionSeccion: distrtio.descripcionSeccion,
                    tipoDeCasilla: distrtio.tipoDeCasilla,
                }));

                // Agrupar los datos por partido y sumar los votos
                const agruparPorPartido = (data) => {
                    return data.reduce((acumulador, item) => {
                        // Si el partido ya existe en el acumulador, suma los votos
                        if (acumulador[item.id_partido]) {
                            acumulador[item.id_partido].total += item.total;
                            // Asegúrate de que el color del partido se mantenga constante
                            acumulador[item.id_partido].imagenPartido =
                                item.imagenPartido;
                        } else {
                            // Si el partido no existe en el acumulador, agrega un nuevo objeto
                            acumulador[item.id_partido] = {
                                nombrePartidoOCoal: item.nombrePartidoOCoal,
                                total: item.total,
                                imagenPartido: item.imagenPartido,
                            };
                        }
                        return acumulador;
                    }, {});
                };

                const resultadosAgrupados = agruparPorPartido(formattedData);
                const resultadosAgrupadosArray = Object.keys(
                    resultadosAgrupados
                ).map((key) => ({
                    id_partido: key,
                    ...resultadosAgrupados[key],
                }));

                setDataAgrupadaVotos(resultadosAgrupadosArray);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (tipoEleccion) {
            getResultadosElecciones(tipoEleccion);
            getResultadosEleccionesagrupado(tipoEleccion);
        }
    }, [tipoEleccion]);

    const [partidosOCoalicion, setPartidosOCoalicion] = useState([]);
    const [totalpartidosOCoalicion, setTotalPartidosOCoalicion] = useState([]);
    const [coloresGrafica, setColoresGrafica] = useState([]);

    const [dataFilter, setDataFilter] = useState([]);
    const [totalesVR, setTotalesVR] = useState(0);
    useEffect(() => {
        console.log("dataResultadosEleccion", dataFilter);
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

        console.log("----------------->", resultadoFinal);

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
            name: "PARTIDO POLITICO O COALICION",

            cell: (row) => (
                <>
                    <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                        //src={`/storage/app/public/${row.img}`}
                        src={`/storage/${row.imagenPartido}`}
                        alt="Imagen del partido"
                        style={{
                            width: "30px",
                            height: "30px",
                        }}
                    />&nbsp;&nbsp;
                        <span>{row.nombrePartidoOCoal}</span>
                    </div>
                </>
            ),
        },
      

        {
            name: "TOTAL DE VOTOS POR CANDIDATURA",
            selector: (row) => row.total,
        },
        {
            name: "PORCENTAJE DE VOTOS POR CANDIDATURA",
            cell: (row) => {
                // Calcular el porcentaje
                let porcentaje = (row.total / totalVotantes) * 100;
        
                return (
                    <>
                     <b>{`${porcentaje.toFixed(2)}%`}</b>
                       
                    </>
                );
            }
        }
        
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
        }
    }, [seccionSelectFil]);

    const [casillaSelectFil, setCasillaSelectFil] = useState(null);

    const handleSelectChangeCasillaFil = (selectedValue2) => {
        const selectedAccount = selectedValue2;
        setCasillaSelectFil(selectedAccount);
    };

    useEffect(() => {
        console.log("first", dataResultadosEleccion);
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
        setDataArray([]);
        setDataArray((prevDataArray) => [
            ...prevDataArray,
            ...inputs.map((input, index) => ({
                id_partido: dataPartidosPoliticos[index].id,
                total: parseInt(input),
                id_casilla: casilla,
                id_eleccion: eleccion,
                id_coalicion: 0,
                id_distrito: distrito,
            })),
            ...inputsCoa.map((inputCoa, index) => ({
                id_partido: 0,
                total: parseInt(inputCoa),
                id_casilla: casilla,
                id_eleccion: eleccion,
                id_coalicion: dataCoaliciones[index].id,
                id_distrito: distrito,
            })),
        ]);
    };

    useEffect(() => {
        console.log("dataArray", dataArray);
    }, [dataArray]);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <ContainerLTE
                title={"Dashboard"}
                buttonadd={
                    <>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn btn-success btn-xl"
                        >
                            <span className="fas fa-sync-alt" />
                        </button>
                        <button
                            className="btn btn-danger btn-xs float-end"
                            onClick={handleConfirmDelete}
                        >
                            <span className="fas fa-trash" /> Truncar BD
                        </button>
                    </>
                }
            >
                <div className="row">
                    <div className="col-md-7">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg ">
                            <div className="form-group mt-2">
                                <label htmlFor="nombreInput">
                                    Selecciona el tipo de elección:{" "}
                                    <code>*</code>
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
                                        <span
                                            style={{
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            <span className="fas fa-table" />{" "}
                                            Tabla
                                        </span>
                                    }
                                >
                                    <>
                                        <DataTablecustom
                                            columnas={columns}
                                            datos={dataAgrupadaVotos}
                                        />
                                        <Row className="mt-2 mt-md-2 mt-lg-2">
                                            <Col md={{ span: 4, offset: 8 }}>
                                                <Table>
                                                    <tbody>
                                                        <tr>
                                                            <td
                                                                style={
                                                                    cellStyles
                                                                }
                                                            >
                                                                Avance Total de votos
                                                                registrados
                                                            </td>
                                                            <td
                                                                style={
                                                                    cellStyles2
                                                                }
                                                            >
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
                                        <span
                                            style={{
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            <span className="fas fa-chart-line" />{" "}
                                            Gráfico
                                        </span>
                                    }
                                >
                                    <div style={{ maxHeight: "70vh" }}>
                                        {dataResultadosEleccion.length > 0 ? (
                                            <DynamicChart
                                                frecuencias={
                                                    totalpartidosOCoalicion
                                                }
                                                etiquetas={partidosOCoalicion}
                                                chartType={"bar"}
                                                titInfo={"Total de votos"}
                                                bgColor={coloresGrafica}
                                                chartTitle={
                                                    "TOTALES DE VOTOS PARA PARTIDOS POLITICOS Y COALICIONES"
                                                }
                                                alto={"450px"}
                                                total={totalLista}
                                            />
                                        ) : (
                                            <p>Cargando...</p>
                                        )}
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg  mt-2">
                            <div className="form-group">
                                <label htmlFor="nombreInput">
                                    Selecciona un distrito:
                                </label>
                                <div className="row">
                                    <CustomSelect
                                        dataOptions={dataDist.map((role) => ({
                                            value:
                                                role.id +
                                                "|" +
                                                role.total +
                                                "|" +
                                                role.avance,
                                            label: role.distrito,
                                        }))}
                                        preDefaultValue={distrito}
                                        setValue={handleSelectChangeDistrito}
                                    />
                                </div>
                            </div>

                            <div className="card-footer">
                                <div className="row">
                                    <div className="col-md-12 col-sm-12">
                                        <div className="row text-xs bg-info">
                                            <div className="col-sm-4 border-right">
                                                <div className="description-block">
                                                    <h5 className="description-header">
                                                        {totalLista}
                                                    </h5>
                                                    <span className="description-text text-xs">
                                                        Lista nominal del
                                                        distrito
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-sm-4 border-right">
                                                <div className="description-block">
                                                    <h5 className="description-header">
                                                        {totalAvance}
                                                    </h5>

                                                    <span className="description-text text-2xs">
                                                        Avance Total de votos registrados
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-sm-4 ">
                                                <div className="description-block">
                                                    <h5 className="description-header" style={{color:"red"}}>
                                                        {porcentaje}%
                                                    </h5>
                                                    <span className="description-text text-xs">
                                                        Porcentaje capturado
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="justify-center align-middle">
                                            {distrito ? (
                                                <DynamicChart
                                                    frecuencias={datosGraph}
                                                    etiquetas={etiquetasGraph}
                                                    chartType={"pie"}
                                                    bgColor={[
                                                        "#4AF891",
                                                        "#E1E1E1",
                                                    ]}
                                                    chartTitle={
                                                        "Participación ciudadana"
                                                    }
                                                    alto={"300px"}
                                                />
                                            ) : (
                                                <p>
                                                    Esperando datos{" "}
                                                    <Spinner
                                                        animation="grow"
                                                        size="sm"
                                                    />
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-sm-12 ">
                                        <div className="row text-xs bg-info">
                                            <div className="col-sm-4 border-right">
                                                <div className="description-block">
                                                    <h5 className="description-header">
                                                        {TotalVotos}
                                                    </h5>
                                                    <span className="description-text text-xs">
                                                        Total de votos
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-sm-4 border-right">
                                                <div className="description-block">
                                                    <h5 className="description-header">
                                                        {TotalVotosNulos}
                                                    </h5>

                                                    <span className="description-text text-2xs">
                                                        Total de votos nulos
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-sm-4">
                                                <div className="description-block">
                                                    <h5 className="description-header" style={{color:"red"}}>
                                                        {TotalVotosNoNulos}
                                                    </h5>
                                                    <span className="description-text text-xs">
                                                        Votos validos
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="  justify-center align-middle">
                                            <DynamicChart
                                                frecuencias={graficaTot}
                                                etiquetas={porcentajes}
                                                chartType={"pie"}
                                                bgColor={["#4AF891", "#E1E1E1"]}
                                                chartTitle={`Avances de actas: ${actasCapturadas} capturadas, ${actasFaltantes} faltantes, ${TotalactasaCapturadas} totales`}
                                                alto={"300px"}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ContainerLTE>
        </AuthenticatedLayout>
    );
}
