document.addEventListener('DOMContentLoaded', function(){
    crearGaleria()
})

function crearGaleria(){
    const galeria = document.querySelector('.galeria-imagenes');

    for(let i = 1; i<=16; i++){
        const imagen = document.createElement('IMG');
        imagen.src = `src/ima/gallery/full/${i}.jpg`;
        imagen.alt = `Imagen Galería`;
        

        // Event Handler
        imagen.onclick = function(){
            console.log('Diste click...')
        }
        galeria.appendChild(imagen)
    }
}


