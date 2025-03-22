document.addEventListener('DOMContentLoaded', function(){
    navegacionfija();
    crearGaleria();
    resaltarEnlace();
    scrollNAv();
})


function resaltarEnlace(){
    document.addEventListener('scroll', function(){
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.navegacion-principal a')

        let actual = '';
        sections.forEach(section=>{
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if(window.scrollY >= (sectionTop - sectionHeight / 3)){
                actual = section.id;
            }
        })
        navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('href') === '#' + actual){
                link.classList.add('active');
            }
        })
    })
}
function navegacionfija(){
    const header = document.querySelector('.header');
    const sobreFestival = document.querySelector('.sobre-festival');

    window.addEventListener('scroll', function(){
        if(sobreFestival.getBoundingClientRect().bottom<1){
            header.classList.add('fixed')
        }else{
            header.classList.remove('fixed')
        }
    })
}
function crearGaleria(){
    const galeria = document.querySelector('.galeria-imagenes');

    for(let i = 1; i<=16; i++){
        const imagen = document.createElement('IMG');
        imagen.src = `src/img/gallery/full/${i}.jpg`;
        imagen.alt = `Imagen Galería`;
        

        // Event Handler
        imagen.onclick = function(){
            mostrarImagen(i);
        }
        galeria.appendChild(imagen)
    }
}
function mostrarImagen(i){
    const imagen = document.createElement('IMG');
    imagen.src = `src/img/gallery/full/${i}.jpg`;
    imagen.alt = `Imagen Galería`;

    // Generar modal
    const modal = document.createElement('DIV');
    modal.classList.add('modal');
    

    

    // Boton cerrar modal
    const CerrarModalboton = document.createElement('BUTTON');
    CerrarModalboton.textContent = 'X';
    CerrarModalboton.classList.add('botonCerrar');
    CerrarModalboton.onclick = cerrarModal;

    
    modal.appendChild(imagen);
    modal.appendChild(CerrarModalboton);

    // Agregar HTML
    const body = document.querySelector('body');
    body.appendChild(modal);
    body.classList.add('overflow-hidden')
    
    
}
function cerrarModal(){
    const modal = document.querySelector('.modal');
    const body = document.querySelector('body');
    body.classList.remove('overflow-hidden')
    modal.classList.add('fadeOut')
    setTimeout(()=>{
        modal?.remove()
    },500)
    
}
function scrollNAv(){
    const navLinks = document.querySelectorAll('.navegacion-principal a');

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const sectionScroll = e.target.getAttribute('href');
            const section = document.querySelector(sectionScroll);

            section.scrollIntoView({behavior: 'smooth'})
        })
    })
}
