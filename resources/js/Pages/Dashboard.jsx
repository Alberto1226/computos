import CustomSelect from "@/Components/Generales/CustomSelect";
import DynamicChart from "@/Components/Generales/Grafica";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { useEffect } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";

export default function Dashboard({ auth }) {
    const [distrito, setDistrito] = useState(null);
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
                    total: distrtio.votosTotales,
                    avance: distrtio.avanceVotos,
                }));
                // Establecer los departamentos en el estado
                setDataDist(formattedData);
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
                console.log("Response data:", response.data);
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

    useEffect(() => {
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
    console.log("datosGraoh", datosGraph);
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
            <button
                className="btn btn-danger btn-xs float-end"
                onClick={handleConfirmDelete}
            >
                <span className="fas fa-trash" /> Truncar BD
            </button>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-4">
                        <div className="form-group">
                            <label htmlFor="nombreInput">
                                Selecciona un distrito:
                            </label>
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
                        <div className="card-footer">
                            <div className="row">
                                <div className="col-md-6 col-sm-12">
                                    <div className="row">
                                        <div className="col-sm-4 border-right">
                                            <div className="description-block">
                                                <h5 className="description-header">
                                                    {totalLista}
                                                </h5>
                                                <span className="description-text">
                                                    Lista nominal del distrito
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-sm-4 border-right">
                                            <div className="description-block">
                                                <h5 className="description-header">
                                                    {totalAvance}
                                                </h5>
                                                <span className="description-text">
                                                    Avance
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="description-block">
                                                <h5 className="description-header">
                                                    {porcentaje}%
                                                </h5>
                                                <span className="description-text">
                                                    Porcentaje capturado
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center items-center">
                                        {distrito ? (
                                            <DynamicChart
                                                frecuencias={datosGraph}
                                                etiquetas={etiquetasGraph}
                                                chartType={"pie"}
                                                bgColor={["#4AF891", "#E1E1E1"]}
                                                chartTitle={
                                                    "Avances de votos registrados"
                                                }
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
                                <div className="col-md-6 col-sm-12">
                                    <div className="  justify-center align-middle">
                                        <DynamicChart
                                            frecuencias={graficaTot}
                                            etiquetas={porcentajes}
                                            chartType={"pie"}
                                            bgColor={["#4AF891", "#E1E1E1"]}
                                            chartTitle={`Avances de actas: ${actasCapturadas} capturadas, ${actasFaltantes} faltantes, ${TotalactasaCapturadas} totales`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
