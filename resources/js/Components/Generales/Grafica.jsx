import React from "react";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import 'chart.js/auto';

const DynamicChart = ({ frecuencias, etiquetas, chartType, chartTitle, titInfo, bgColor }) => {
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

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: chartTitle,
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
    <div style={{ width: "90%", maxHeight: "400px", display: "flex", alignItems: "center", alignContent: "center" }}>
      <ChartComponent data={data} options={chartOptions} />
    </div>
  );
};

export default DynamicChart;
