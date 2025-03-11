// Datos de prueba (puedes conectarlos a una API)
const topSellers = ["Refrigerador LG", "Laptop HP", "TV Samsung", "Lavadora Whirlpool"];
const topProfit = ["Aire Acondicionado Panasonic", "Lavavajillas Bosch", "Microondas Samsung"];
const topDiscounts = ["Celular Xiaomi -50%", "Smartwatch Samsung -40%", "Audífonos Bose -35%"];

// Insertar datos en el HTML
const insertList = (id, data) => {
  const container = document.getElementById(id);
  container.innerHTML = data.map(item => `<li>${item}</li>`).join("");
};

insertList("top-sellers", topSellers);
insertList("top-profit", topProfit);
insertList("top-discounts", topDiscounts);

// Gráfico de pedidos por proveedor
const ctx = document.getElementById('providersChart').getContext('2d');
new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Samsung', 'LG', 'Sony', 'Whirlpool', 'Bosch'],
    datasets: [{
      data: [35, 25, 15, 10, 15],
      backgroundColor: ['#5865F2', '#A3AED0', '#D9DBE9', '#6D8B74', '#333A56']
    }]
  }
});
