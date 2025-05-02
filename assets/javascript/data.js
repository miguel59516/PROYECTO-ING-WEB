// data.js - Simulación de API de electrodomésticos
const productos = [
  { id: 1, nombre: "Televisor Samsung 55\"", categoria: "Televisores", stock: 15, precio: 1200, utilidad: 300 },
  { id: 2, nombre: "iPhone 15", categoria: "Celulares", stock: 10, precio: 999, utilidad: 250 },
  { id: 3, nombre: "Lavadora LG 18kg", categoria: "Lavadoras", stock: 8, precio: 750, utilidad: 200 },
  { id: 4, nombre: "Bocina Bose SoundLink", categoria: "Bocinas", stock: 12, precio: 350, utilidad: 100 }
]

const pedidos = [
  { proveedor: "Samsung", total: 20, completados: 15 },
  { proveedor: "Apple", total: 10, completados: 7 },
  { proveedor: "Bose", total: 8, completados: 5 }
]

// Simula un tiempo de carga
function obtenerProductos() {
  return new Promise(resolve => setTimeout(() => resolve(productos), 300)) // Reducido a 300ms
}

function obtenerPedidos() {
  return new Promise(resolve => setTimeout(() => resolve(pedidos), 300))
}

  