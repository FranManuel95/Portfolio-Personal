const divHoras = document.querySelector('.divHoras');
const divMinutos = document.querySelector('.divMinutos');
const divSegundos = document.querySelector('.divSegundos');
const play = document.querySelector('.play');
const restart = document.querySelector('.restart');
const pause = document.querySelector('.pause');


const cronometro = document.querySelector('.crono')

let horas = 0;
let minutos = 0;
let segundos = 0;
let intervalID = null;



function contadorSegundos() {
    if(intervalID){
        return
    }
    intervalID= setInterval(function () {
        // Incrementa los segundos
        segundos++;
        
        // Si los segundos llegan a 60, reinícialos y aumenta los minutos
        if (segundos === 60) {
            segundos = 0;
            minutos++;
        }

        // Si los minutos llegan a 60, reinícialos y aumenta las horas
        if (minutos === 60) {
            minutos = 0;
            horas++;
        }

        // Formato de dos dígitos para cada unidad de tiempo
        divSegundos.innerHTML = segundos < 10 ? `0${segundos}` : segundos;
        divMinutos.innerHTML = minutos < 10 ? `0${minutos}` : minutos;
        divHoras.innerHTML = horas < 10 ? `0${horas}` : horas;

       
    }, 1000);
}

function iniciador(){
    contadorSegundos();
    cronometro.style.color="green";
}
function detenerContador() {
    clearInterval(intervalID); // Detiene el intervalo actual
    intervalID = null; // Reinicia el identificador
    cronometro.style.color="red";
}

play.addEventListener('click',iniciador);
pause.addEventListener('click', () => {
    detenerContador(); // Detiene el cronómetro
});



restart.addEventListener('click', () => {
    detenerContador(); // Detiene el cronómetro
    horas = 0;
    minutos = 0;
    segundos = 0; // Reinicia las variables
    divSegundos.innerHTML = '00';
    divMinutos.innerHTML = '00';
    divHoras.innerHTML =  '00';
    cronometro.style.color="black";
});

