function cambiarColor() { 
// 1 .. Seleccionar el elemento div por su ID.
let caja = document.getElementById('caja-colorida'); 
// 2. Usar classlist para verificar y manipular clases CSS. 
//Si la caja ya tiene la clase 'color-alternativo', la quita. 
// Si no la tiene, la anade.
caja.classList.toggle('color-alternativo');
}