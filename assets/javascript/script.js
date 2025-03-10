// Datos de ejemplo para gráficos
const createChart = (canvasId, data, color) => {
    new Chart(document.getElementById(canvasId), {
      type: 'bar',
      data: {
        labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
        datasets: [{
          label: '',
          data: data,
          backgroundColor: color,
          borderRadius: 5,
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
  };
  
  createChart('ordersChart', [40, 35, 50, 45], '#5865F2');
  createChart('weightChart', [30, 32, 28, 31], '#A3AED0');
  createChart('distanceChart', [800, 850, 900, 872], '#D9DBE9');
  