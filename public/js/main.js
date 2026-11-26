// Referencias a los elementos del HTML (DOM)
const estadoConexion = document.getElementById('estado-conexion');
const infoServidor = document.getElementById('info-servidor');
const formBusqueda = document.getElementById('form-busqueda');
const inputBusqueda = document.getElementById('input-busqueda');
const btnLimpiar = document.getElementById('btn-limpiar');
const contadorResultados = document.getElementById('contador-resultados');
const cuadroResultados = document.getElementById('cuadro-resultados');

// 1. Verificar estado de la conexión con MariaDB al abrir la página
async function verificarConexion() {
  try {
    const response = await fetch('/api/databases');
    const data = await response.json();

    if (data.ok) {
      estadoConexion.className = 'badge exito';
      estadoConexion.textContent = 'Conectado a MariaDB';
      infoServidor.textContent = `${data.servidor}:${data.puerto} (${data.usuario})`;
    } else {
      estadoConexion.className = 'badge error';
      estadoConexion.textContent = 'Sin conexión a BD';
      infoServidor.textContent = data.error || '';
    }
  } catch (err) {
    estadoConexion.className = 'badge error';
    estadoConexion.textContent = 'Servidor desconectado';
  }
}

// 2. Función que envía el texto buscado al backend y muestra los resultados en el cuadro
async function ejecutarBusqueda(termino) {
  cuadroResultados.innerHTML = '<div class="empty-state">Consultando datos en el servidor...</div>';
  contadorResultados.textContent = 'Consultando...';

  try {
    const url = `/api/buscar?q=${encodeURIComponent(termino)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.ok) {
      contadorResultados.textContent = 'Error en consulta';
      cuadroResultados.innerHTML = `<div class="empty-state error-text">Error al consultar: ${data.error || data.mensaje}</div>`;
      return;
    }

    renderizarTablaResultados(data.resultados || []);
  } catch (err) {
    contadorResultados.textContent = 'Error';
    cuadroResultados.innerHTML = `<div class="empty-state error-text">No se pudo conectar con el servidor: ${err.message}</div>`;
  }
}

// 3. Dibuja dinámicamente una tabla en el cuadro inferior con cualquier fila que devuelva MariaDB
function renderizarTablaResultados(filas) {
  if (!filas || filas.length === 0) {
    contadorResultados.textContent = '0 resultados';
    cuadroResultados.innerHTML = '<div class="empty-state">No se encontraron datos para esta búsqueda.</div>';
    return;
  }

  contadorResultados.textContent = `${filas.length} registro(s) encontrado(s)`;

  // Obtener los nombres de las columnas automáticamente desde el primer registro
  const columnas = Object.keys(filas[0]);

  const tabla = document.createElement('table');
  tabla.className = 'results-table';

  // Crear encabezado de la tabla (<thead>)
  const thead = document.createElement('thead');
  const trHead = document.createElement('tr');
  columnas.forEach((col) => {
    const th = document.createElement('th');
    th.textContent = col;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  tabla.appendChild(thead);

  // Crear cuerpo de la tabla (<tbody>) con los datos
  const tbody = document.createElement('tbody');
  filas.forEach((fila) => {
    const tr = document.createElement('tr');
    columnas.forEach((col) => {
      const td = document.createElement('td');
      td.textContent = fila[col] !== null && fila[col] !== undefined ? fila[col] : '-';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  tabla.appendChild(tbody);

  // Insertar la tabla en el cuadro de visualización
  cuadroResultados.innerHTML = '';
  cuadroResultados.appendChild(tabla);
}

// Evento al enviar el formulario con el botón "Buscar" o la tecla Enter
formBusqueda.addEventListener('submit', (e) => {
  e.preventDefault();
  const termino = inputBusqueda.value.trim();
  ejecutarBusqueda(termino);
});

// Evento del botón "Limpiar" para reiniciar la barra y el cuadro
btnLimpiar.addEventListener('click', () => {
  inputBusqueda.value = '';
  contadorResultados.textContent = 'Sin consulta activa';
  cuadroResultados.innerHTML = '<div class="empty-state">Ingresa un término en la barra de búsqueda y presiona <strong>Buscar</strong> para visualizar los datos.</div>';
  inputBusqueda.focus();
});

// Comprobar estado del servidor al cargar la página
verificarConexion();
