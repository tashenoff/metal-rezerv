// components/ResponseStatsChart.js

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, ArcElement, Title, CategoryScale } from 'chart.js';

// Регистрируем необходимые компоненты для диаграмм
ChartJS.register(Tooltip, Legend, ArcElement, Title, CategoryScale);

const ResponseStatsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>Нет данных для отображения</p>;
  }

  const chartData = {
    labels: ['Принятые', 'Отклонённые', 'В ожидании'],
    datasets: [
      {
        data: [data.accepted, data.rejected, data.pending],
        backgroundColor: ['#4caf50', '#f44336', '#ff9800'], // Цвета
        borderWidth: 0, // Убираем обводку
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom', // Позиция легенды внизу
        align: 'start', // Выравнивание элементов легенды по левому краю
        marginTop: 10, 
        labels: {
          font: {
            family: 'Montserrat', // Шрифт для легенды
            size: 12,
            weight: 'bold',
            color: '#333', // Цвет текста
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Цвет фона подсказки
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
        footerFont: {
          size: 10,
        },
        titleColor: '#fff',
        bodyColor: '#fff',
        footerColor: '#fff',
      },
    },
    responsive: true,
    cutout: '75%', // Уменьшаем внутренний диаметр
    maintainAspectRatio: false, // Диаграмма займет весь блок
    layout: {
      padding: {
        bottom: 20, // Добавление отступа между диаграммой и легендой
      },
    },
  };

  return (
    <div className="my-5" style={{ width: '100%', height: '200px' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default ResponseStatsChart;
