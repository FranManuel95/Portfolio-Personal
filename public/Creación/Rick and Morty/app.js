const url = 'https://rickandmortyapi.com/api/character';

function getCharacters() {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const charactersDiv = document.getElementById('characters');
     
      data.results.slice(5).forEach(character => {  
        // Crear el HTML con clases de Bootstrap
        const characterElement = document.createElement('div');
        characterElement.classList.add('col-md-4', 'mb-4'); // Columnas responsivas

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
    })
    .catch(error => console.error("Error en la solicitud:", error));
}

getCharacters();
