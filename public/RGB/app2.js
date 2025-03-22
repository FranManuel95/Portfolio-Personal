// const valor = document.querySelector(".valor");
// const output = document.querySelector(".valor-output");
// const valor1 = document.querySelector(".valor1");
// const output1 = document.querySelector(".valor-output1");
// const valor2 = document.querySelector(".valor2");
// const output2 = document.querySelector(".valor-output2");

// output.textContent = valor.value;
// output1.textContent = valor1.value;
// output2.textContent = valor2.value;

// let rgb1 = valor.addEventListener("input", function () {
//   output.textContent = valor.value;
//   document.body.style.backgroundColor = `rgb(${output.textContent},${output1.textContent},${output2.textContent})`;
// });
// let rgb2 = valor1.addEventListener("input", function () {
//     output1.textContent = valor1.value;
//     document.body.style.backgroundColor = `rgb(${output.textContent},${output1.textContent},${output2.textContent})`;
// });
// let rgb3= valor2.addEventListener("input", function () {
//     output2.textContent = valor2.value;
//     document.body.style.backgroundColor = `rgb(${output.textContent},${output1.textContent},${output2.textContent})`;
// });

// CHAT GPT, RESUMIR:

// const valor = document.querySelector(".valor");
// const output = document.querySelector(".valor-output");
// const valor1 = document.querySelector(".valor1");
// const output1 = document.querySelector(".valor-output1");
// const valor2 = document.querySelector(".valor2");
// const output2 = document.querySelector(".valor-output2");

// function actualizarColor() {
//   output.textContent = valor.value;
//   output1.textContent = valor1.value;
//   output2.textContent = valor2.value;
//   document.body.style.backgroundColor = `rgb(${output.textContent}, ${output1.textContent}, ${output2.textContent})`;
// }

// actualizarColor(); // Para poner los valores iniciales

// valor.addEventListener("input", actualizarColor);
// valor1.addEventListener("input", actualizarColor);
// valor2.addEventListener("input", actualizarColor);

// CHAT GPT, MEJORAR

// Selección de los inputs y outputs
const inputs = document.querySelectorAll('.valor, .valor1, .valor2');
const outputs = document.querySelectorAll('.valor-output, .valor-output1, .valor-output2');

// Función para actualizar los valores y el fondo
function actualizarColor() {
  // Iterar sobre los inputs y outputs
  inputs.forEach((input, index) => {
    // Actualizar los outputs correspondientes
    outputs[index].textContent = input.value;
  });

  // Cambiar el color de fondo
  document.body.style.backgroundColor = `rgb(${outputs[0].textContent}, ${outputs[1].textContent}, ${outputs[2].textContent})`;
}

// Inicialización
actualizarColor(); // Para poner los valores iniciales

// Asignar el evento 'input' a todos los inputs de manera eficiente
inputs.forEach(input => {
  input.addEventListener('input', actualizarColor);
});