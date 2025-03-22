function peticion(){
   fetch("\json3.json")
  .then(response => response.json())
  .then(data => {
    
    const texto = document.querySelector('.texto');
    const autor = document.querySelector('.autor');

    let citaAleatoria = Math.floor(Math.random() * data.length);
    texto.textContent = data[citaAleatoria].cita;
    autor.textContent = data[citaAleatoria].autor;
    
    });
}

const boton = document.querySelector('.siguiente');
boton.addEventListener('click', peticion);