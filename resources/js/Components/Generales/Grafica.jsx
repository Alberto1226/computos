import React from "react";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import 'chart.js/auto';
import 'chartjs-plugin-datalabels'; // Importa el plugin

const DynamicChart = ({ frecuencias, etiquetas, chartType, chartTitle, titInfo, bgColor, alto }) => {
  const data = {
    labels: etiquetas,
    datasets: [
      {
        label: titInfo,
        backgroundColor: bgColor,
        borderColor: bgColor,
        data: frecuencias,
      },
    ],
  };

  // Calcula el total de los datos
  const total = frecuencias.reduce((a, b) => a + b, 0);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: chartType === 'bar' ? chartTitle + ' (Total: ' + total + ')' : chartTitle, // Muestra el total solo para gráficos de barras
      },
      datalabels: {
        color: '#fff',
        formatter: (value, context) => {
          return value; // Muestra el valor total
        },
      },
    },
  };

  // Determina el tipo de gráfico dinámicamente
  let ChartComponent;

  switch (chartType) {
    case 'line':
      ChartComponent = Line;
      break;
    case 'bar':
      ChartComponent = Bar;
      break;
    case 'pie':
      ChartComponent = Pie;
      break;
    case 'doughnut':
      ChartComponent = Doughnut;
      break;
    default:
      ChartComponent = Line;
  }
  return (
    <div className="flex justify-center items-center" style={{maxHeight: alto}}>
      <ChartComponent data={data} options={chartOptions} />
    </div>
  );
};

export default DynamicChart;
