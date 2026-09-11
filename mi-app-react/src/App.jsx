import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [tareas, setTareas] = useState([])
  const [nuevoTitulo, setNuevoTitulo] = useState('')
  const [cargando, setCargando] = useState(true)

  // 1. Cargar las tareas al iniciar
  useEffect(() => {
    fetch('http://localhost:3000/api/tareas')
      .then(response => response.json())
      .then(data => {
        setTareas(data)
        setCargando(false)
      })
      .catch(error => {
        console.error("Error conectando a la API:", error)
        setCargando(false)
      })
  }, [])

  // 2. Función para enviar la nueva tarea al backend
  const manejarEnvio = (e) => {
    e.preventDefault()
    if (!nuevoTitulo.trim()) return

    fetch('http://localhost:3000/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: nuevoTitulo })
    })
      .then(response => response.json())
      .then(nuevaTarea => {
        // Añadir la tarea devuelta por PostgreSQL al estado de React
        setTareas([...tareas, nuevaTarea])
        setNuevoTitulo('') // Limpiar la caja de texto
      })
      .catch(error => console.error("Error al crear la tarea:", error))
  }

  return (
    <div className="App" style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1>Panel de Control DevOps</h1>
      <h2>Lista de Objetivos (PostgreSQL Real)</h2>
      
      {/* Formulario de Alta */}
      <form onSubmit={manejarEnvio} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Escribe un nuevo objetivo..." 
          value={nuevoTitulo}
          onChange={(e) => setNuevoTitulo(e.target.value)}
          style={{ flexGrow: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: '#000' }}
        />
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Agregar
        </button>
      </form>

      {cargando ? (
        <p>Cargando datos desde Docker...</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {tareas.map(tarea => (
            <li 
              key={tarea.id} 
              style={{
                background: tarea.completada ? '#2e7d32' : '#37474f',
                margin: '10px 0',
                padding: '15px',
                borderRadius: '8px',
                textDecoration: tarea.completada ? 'line-through' : 'none',
                textAlign: 'left',
                color: '#fff'
              }}
            >
              {tarea.completada ? '✅' : '⏳'} {tarea.titulo}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
