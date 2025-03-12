document.addEventListener("DOMContentLoaded", async () => {
  const statsContainer = document.getElementById("stats-container")

  const productos = await obtenerProductos()
  const pedidos = await obtenerPedidos()

  // Mostrar tarjetas de productos
  productos.forEach(producto => {
    const card = document.createElement("div")
    card.classList.add("stat-card")
    card.innerHTML = `
      <h3>${producto.nombre}</h3>
      <p><strong>Categoría:</strong> ${producto.categoria}</p>
      <p><strong>Stock:</strong> ${producto.stock}</p>
      <p><strong>Precio:</strong> $${producto.precio}</p>
    `
    statsContainer.appendChild(card)
  })

  // Crear gráficos de pedidos
  const colores = {
    Samsung: "#4CC9F0",
    Apple: "#FF006E",
    Bose: "#F4A261"
  }

  function crearGrafico(idCanvas, proveedor) {
    const pedido = pedidos.find(p => p.proveedor === proveedor)
    if (!pedido) return

    new Chart(document.getElementById(idCanvas).getContext("2d"), {
      type: "doughnut",
      data: {
        labels: ["Completados", "Pendientes"],
        datasets: [{
          data: [pedido.completados, pedido.total - pedido.completados],
          backgroundColor: [colores[proveedor], "#333"],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    })
  }

  crearGrafico("chartSamsung", "Samsung")
  crearGrafico("chartApple", "Apple")
  crearGrafico("chartBose", "Bose")
})

document.addEventListener("DOMContentLoaded", async () => {
  const pedidos = await obtenerPedidos()

  // Definir colores representativos para cada marca
  const colores = {
    Samsung: "#4CC9F0", // Azul claro
    Apple: "#FF006E", // Rosa intenso
    Bose: "#F4A261" // Naranja
  }

  // Función para generar el gráfico de cada proveedor
  function crearGrafico(idCanvas, proveedor) {
    const pedido = pedidos.find(p => p.proveedor === proveedor)
    if (!pedido) return

    const ctx = document.getElementById(idCanvas).getContext("2d")

    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Completados", "Pendientes"],
        datasets: [{
          data: [pedido.completados, pedido.total - pedido.completados],
          backgroundColor: [colores[proveedor], "#333"], // Color de la marca + gris oscuro
          borderWidth: 2,
          borderColor: "#ffffff22" // Bordes suaves con transparencia
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    })
  }

  // Crear gráficos para cada proveedor
  crearGrafico("chartSamsung", "Samsung")
  crearGrafico("chartApple", "Apple")
  crearGrafico("chartBose", "Bose")
})