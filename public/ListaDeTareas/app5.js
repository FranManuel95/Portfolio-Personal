const tareasContenedor = document.querySelector('.tareas-contenedor');
const boton = document.querySelector('.boton-agregar');
const input = document.querySelector(".input");


if (tareasContenedor && boton && input) {
    boton.addEventListener('click', function () {
      if (input.value.trim() !== "") {
        const tarea = document.createElement("div");
        tarea.classList.add("tarea");
        tareasContenedor.appendChild(tarea);
  
        let valorInput = input.value.trim();
        tarea.innerHTML = `
            <p class="tarea-parrafo">${valorInput}</p>
            <div class="contenedor-botones">
                <button class="botones si" type="button">
                    <img src="si.png" alt="">
                </button>
                <button style="display: none;" class="botones no" type="button">
                    <img src="no-es-igual-a.png" alt="">
                </button>
                <button class="botones eliminar" type="button">
                    <img src="eliminar.png" alt="">
                </button>
            </div>`;
  
        input.value = "";
        console.log('Botón en acción');
      } else {
        alert("Por favor, introduzca una tarea");
      }
    });
  
    // Delegación de eventos
    tareasContenedor.addEventListener('click', function (event) {
      if (event.target.closest('.si')) {
        const botonSi = event.target.closest('.si');
        const contenedorBotones = botonSi.closest('.contenedor-botones');
        const botonNo = contenedorBotones.querySelector('.no');
        const tarea = botonSi.closest('.tarea');
  
        tarea.classList.add("tarea-parrafo-no");
        botonSi.style.display = "none";
        botonNo.style.display = "block";
      }
  
      if (event.target.closest('.no')) {
        const botonNo = event.target.closest('.no');
        const contenedorBotones = botonNo.closest('.contenedor-botones');
        const botonSi = contenedorBotones.querySelector('.si');
        const tarea = botonNo.closest('.tarea');
  
        tarea.classList.remove("tarea-parrafo-no");
        botonNo.style.display = "none";
        botonSi.style.display = "block";
      }
  
      if (event.target.closest('.eliminar')) {
        const tarea = event.target.closest('.tarea');
        tarea.remove();
        console.log('Tarea eliminada');
      }
    });
  } else {
    console.error("Algunos elementos no existen en el DOM.");
  }
  