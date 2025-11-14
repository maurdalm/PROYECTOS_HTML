// Agrega interactividad simple a la galería
const fotos = document.querySelectorAll(".foto-item");

fotos.forEach((foto, index) => {
  foto.addEventListener("click", () => {
    alert(`Has hecho clic en la foto ${index + 1}`);
  });
});
