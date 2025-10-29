// Obtiene la referencia al Input de la pantalla
const display = document.getElementById('display'); 

// Función para afadir el valor del botón a la pantalla
function appendToDisplay(value) {
display.value += value; 
} 

// Función para borrar la pantalla
function clearDisplay() {
display.value="";
} 

// Función para calcular el resultado
function calculateResult() {
try {

// Usa la función eval() para evaluar la expresión matemática en la cadena
// Nota: eval() es potente, pero se debe usar con cautela en producción.
// Para este ejercicio sencillo, es suficiente.

display.value= eval(display.value);
} catch (e){ 
// Muestra "Error" si la expresin es inv~lida (ej. "5 +/") 
display.value = 'Error'; 
} 
}