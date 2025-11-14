// Script para resaltar el enlace activo al hacer clic
const enlaces = document.querySelectorAll(".barra-nav a");

enlaces.forEach(enlace => {
  enlace.addEventListener("click", e => {
    e.preventDefault(); // Evita que recargue la página

    // Quitar la clase activo de todos los enlaces
    enlaces.forEach(a => a.classList.remove("activo"));
    // Agregarla al enlace seleccionado
    enlace.classList.add("activo");
  });
});
