// CÓDIGO JAVASCRIPT
// -----------------------------------------------------
// 1. Obtener referencias a elementos clave
const form = document.getElementById('registroForm');
const inputNombre = document.getElementById('nombre');
const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');
const selectCiudad = document.getElementById('ciudad');
// Obtener referencias a los contenedores de error
const errorNombre = document.getElementById('errorNombre');
const errorEmail = document.getElementById('errorEmail');
const errorPassword = document.getElementById('errorPassword');
const errorCiudad = document.getElementById('errorCiudad');
// 2. Función de validación de Email (Regex)
function validarEmail(email) {
// Expresión regular simple para validar formato de email
const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
return regex.test(String(email).toLowerCase());
}
// 3. Función para mostrar/ocultar mensajes de error
function mostrarError(elementoError, mensaje) {
elementoError.textContent = mensaje;
}
// 4. Función de validación de todos los campos
function validarFormulario() {
let esValido = true; // Flag de validación
// Validar Nombre (no vacío y longitud mínima de 3)
if (inputNombre.value.trim() === '') {
mostrarError(errorNombre, 'El nombre es obligatorio.');
esValido = false;
} else if (inputNombre.value.trim().length < 3) {
mostrarError(errorNombre, 'El nombre debe tener al menos 3 caracteres.');
esValido = false;
} else {
mostrarError(errorNombre, ''); // Limpiar error
}
// Validar Email (no vacío y formato correcto)
if (inputEmail.value.trim() === '') {
mostrarError(errorEmail, 'El correo electrónico es obligatorio.');
esValido = false;
} else if (!validarEmail(inputEmail.value)) {
mostrarError(errorEmail, 'Introduce un correo electrónico válido.');
esValido = false;
} else {
mostrarError(errorEmail, '');
}
// Validar Contraseña (no vacía y longitud mínima de 6)
if (inputPassword.value === '') {
mostrarError(errorPassword, 'La contraseña es obligatoria.');
esValido = false;
} else if (inputPassword.value.length < 6) {
mostrarError(errorPassword, 'La contraseña debe tener al menos 6 caracteres.');
esValido = false;
} else {
mostrarError(errorPassword, '');
}
// Validar Lista Desplegable (que no sea la opción por defecto con value="")
/*if (selectCiudad.value === "") {
mostrarError(errorCiudad, 'Debe seleccionar una ciudad.');
esValido = false;
} else {
mostrarError(errorCiudad, '');
}*/
return esValido;
}
// 5. Agregar el event listener al evento 'submit' del formulario
form.addEventListener('submit', function (evento) {
// Primero, prevenir el envío por defecto (que recargaría la página)
evento.preventDefault();
// Ejecutar la validación
if (validarFormulario()) {
// Si la validación pasa, aquí iría la lógica de envío
// Por ejemplo: AJAX (fetch/XMLHttpRequest) o envío directo: form.submit();
// En este ejemplo didáctico, solo mostramos un mensaje
alert('¡Formulario validado y listo para enviar! (Simulación de envío)');
// Para enviar realmente, se descomentaría la siguiente línea:
form.submit();
window.location.href = "./index.html";
} else {
// Si la validación falla, los errores ya se han mostrado
alert('Por favor, corrige los errores del formulario.');
}
});
// 6. Opcional: Validar en tiempo real al escribir (evento 'input' o 'blur')
inputNombre.addEventListener('blur', validarFormulario); // Valida al salir del campo
inputEmail.addEventListener('blur', validarFormulario);
inputPassword.addEventListener('blur', validarFormulario);
selectCiudad.addEventListener('change', validarFormulario); // Valida al cambiar la opción
