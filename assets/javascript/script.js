document.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log("🚀 Iniciando aplicación...")

    const statsContainer = document.getElementById("stats-container")
    const chartsContainer = document.getElementById("charts-container")

    if (!statsContainer || !chartsContainer) {
      console.error("❌ Error: No se encontraron los contenedores necesarios.")
      return
    }

    // Obtener datos simultáneamente
    const [productos, pedidos] = await Promise.all([obtenerProductos(), obtenerPedidos()])

    // Verificar que los datos se obtuvieron correctamente
    console.log("📊 Productos cargados:", productos)
    console.log("📈 Pedidos cargados:", pedidos)

    if (!productos.length) {
      console.warn("⚠️ No hay productos disponibles.")
    }

    if (!pedidos.length) {
      console.warn("⚠️ No hay pedidos disponibles.")
    }

    // Renderizar productos y gráficos
    renderizarProductos(productos, statsContainer)
    renderizarGraficos(pedidos, chartsContainer)

    // Configurar modo oscuro
    configurarModoOscuro()
  } catch (error) {
    console.error("❌ Error al cargar los datos:", error)
  }
})

/** 🔹 Renderizar tarjetas de productos */
function renderizarProductos(productos, contenedor) {
  if (!contenedor) {
    console.error("❌ Error: Contenedor de productos no encontrado.")
    return
  }

  contenedor.innerHTML = ""

  productos.forEach(({ nombre, categoria, stock, precio, utilidad }) => {
    const card = document.createElement("div")
    card.classList.add("stat-card")
    card.innerHTML = `
      <h3>${nombre}</h3>
      <p><strong>Categoría:</strong> ${categoria}</p>
      <p><strong>Stock:</strong> ${stock}</p>
      <p><strong>Precio:</strong> $${precio}</p>
      <p><strong>Utilidad:</strong> $${utilidad}</p>
    `
    contenedor.appendChild(card)
  })
}

/** 🔹 Renderizar gráficos con Chart.js */
function renderizarGraficos(pedidos, contenedor) {
  if (!contenedor) {
    console.error("❌ Error: Contenedor de gráficos no encontrado.")
    return
  }

  console.log("📊 Renderizando gráficos...")

  const colores = { Samsung: "#4CC9F0", Apple: "#FF006E", Bose: "#F4A261" }

  contenedor.innerHTML = ""

  pedidos.forEach(({ proveedor, completados, total }) => {
    if (!colores[proveedor]) {
      console.warn(`⚠️ No se encontró un color definido para ${proveedor}`)
      return
    }

    const canvas = document.createElement("canvas")
    canvas.id = `chart-${proveedor}`
    canvas.classList.add("chart-item")
    contenedor.appendChild(canvas)

    console.log(`✅ Creando gráfico para ${proveedor} en ${canvas.id}`)
    crearGrafico(canvas, completados, total, colores[proveedor])
  })
}

/** 🔹 Crear un gráfico Doughnut con Chart.js */
function crearGrafico(canvas, completados, total, color) {
  if (!canvas) {
    console.error("❌ Error: No se encontró el canvas para el gráfico.")
    return
  }

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    console.error(`❌ Error: No se pudo obtener el contexto 2D para ${canvas.id}`)
    return
  }

  console.log(`📈 Renderizando gráfico para ${canvas.id}...`)

  // Destruir gráfico previo si existe
  if (canvas.chartInstance) {
    canvas.chartInstance.destroy()
  }

  canvas.chartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Completados", "Pendientes"],
      datasets: [{
        data: [completados, total - completados],
        backgroundColor: [color, "#333"],
        borderWidth: 2,
        borderColor: "#ffffff22"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,  
      aspectRatio: 1.5,
      plugins: { legend: { display: false } }
    }
  })

  // Agregar tiempo de espera para verificar tamaño
  setTimeout(() => {
    console.log(`📏 Tamaño final de ${canvas.id}:`, canvas.clientWidth, canvas.clientHeight)
  }, 500)
}

/** 🔹 Configurar Modo Oscuro */
function configurarModoOscuro() {
  const toggleThemeButton = document.getElementById("toggle-theme")
  if (!toggleThemeButton) {
    console.error("❌ Error: No se encontró el botón de modo oscuro.")
    return
  }

  const aplicarModoOscuro = () => {
    document.body.classList.toggle("dark-mode")
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light")
  }

  // Aplicar tema guardado
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode")
  }

  toggleThemeButton.addEventListener("click", aplicarModoOscuro)
}

/** 🔹 Verificar si Chart.js está cargado */
console.log("📢 Chart.js cargado:", typeof Chart !== "undefined")

// Verificar si los canvas tienen dimensiones
setTimeout(() => {
  document.querySelectorAll("canvas").forEach(canvas => {
    console.log(`📏 Tamaño de ${canvas.id}:`, canvas.clientWidth, canvas.clientHeight)
  })
}, 1000)
