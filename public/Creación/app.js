const url = 'https://rickandmortyapi.com/api/character';

function getCharacters() {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const charactersDiv = document.getElementById('characters');
     
      data.results.slice(0,5).forEach(character => {
        // Crear el HTML con clases de Bootstrap
        const characterElement = document.createElement('div');
        characterElement.classList.add('carta','col-md-4','col-sm-4', 'mb-4'); // Columnas responsivas
        

        characterElement.innerHTML = `
        <div class="card shadow-sm h-100">
          <img src="${character.image}" class="card-img-top" alt="${character.name}">
          <div class="card-body">
            <h5 class="card-title">${character.name}</h5>
            <p class="card-text">Especie: ${character.species}</p>
            <p class="card-text text-muted">Estado: ${character.status}</p>
          </div>
        </div>
        `;
        charactersDiv.appendChild(characterElement);
      });
    ;
    })
    .catch(error => console.error("Error en la solicitud:", error));
}

getCharacters();



// Removed unused timeout variable

function crearCarta() {
const charactersDiv = document.getElementById('characters');
const masPersonajes = document.createElement('div');
masPersonajes.classList.add('carta-mas-personajes','col-md-4','mb-4','col-sm-4');
masPersonajes.innerHTML= `
<div class="card shadow-sm h-100 ">
  <a class="personajes-mas" href="Rick and Morty/index.html"style="padding-top:auto; text-decoration: none; color:black">
  <div style="display: flex; justify-content: center; flex-direction: column; align-items: center;">
  
  <img src="Imagenes/plus-circle-fill.svg" class="bi bi-plus-circle-fill card-img-top" alt="$" style="width:50px; heigth:50px; color: white">
  
  </div>
  
  <div class="card-body">
    <h5 class="card-title">Ver más personajes</h5>
    
  </div>
  </a>
</div>
`;
charactersDiv.appendChild(masPersonajes);
;
}
function myFunction() {
  timeout = setTimeout(crearCarta, 1000);
}
myFunction();


