// Referencias a los elementos del HTML (DOM)
const estadoConexion = document.getElementById('estado-conexion');
const infoServidor = document.getElementById('info-servidor');
const contadorBd = document.getElementById('contador-bd');
const listaDatabases = document.getElementById('lista-databases');
const btnRecargar = document.getElementById('btn-recargar');

// Función de solo lectura que pide al backend la lista de bases de datos
async function consultarBasesDeDatos() {
  estadoConexion.className = 'badge';
  estadoConexion.textContent = 'Consultando bases de datos...';
  listaDatabases.innerHTML = '<li class="db-item">Cargando...</li>';

  try {
    const response = await fetch('/api/databases');
    const data = await response.json();

    infoServidor.textContent = `Servidor: ${data.servidor || '-'} | Puerto: ${data.puerto || '-'} | Usuario: ${data.usuario || '-'}`;

    if (!data.ok) {
      estadoConexion.className = 'badge error';
      estadoConexion.textContent = `Error: ${data.error || data.mensaje}`;
      contadorBd.textContent = '0';
      listaDatabases.innerHTML = `<li class="db-item error-item">No se pudieron listar las bases de datos (${data.codigo || 'Error'}).</li>`;
      return;
    }

    estadoConexion.className = 'badge exito';
    estadoConexion.textContent = data.mensaje;
    contadorBd.textContent = String(data.total);

    // Limpiar y dibujar cada base de datos encontrada
    listaDatabases.innerHTML = '';
    data.databases.forEach((dbName) => {
      const li = document.createElement('li');
      li.className = 'db-item';
      li.textContent = dbName;
      listaDatabases.appendChild(li);
    });
  } catch (err) {
    estadoConexion.className = 'badge error';
    estadoConexion.textContent = 'No hay comunicación con el servidor Node.js: ' + err.message;
  }
}

// Botón para refrescar la consulta manualmente si se desea
btnRecargar.addEventListener('click', consultarBasesDeDatos);

// Ejecutar automáticamente apenas se abre la página
consultarBasesDeDatos();
