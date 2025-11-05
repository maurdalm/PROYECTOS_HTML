function generarTabla() {
    const numero = parseInt(document.getElementById("numero").value);
    const tablaContainer = document.getElementById("tabla-multiplicar");
    tablaContainer.innerHTML = ""; // Limpiar contenido anterior

    if (isNaN(numero)) {
        tablaContainer.innerHTML = "<p>Por favor, ingrese un número válido.</p>";
        return;
    }
    let htmlTabla = `<h2>Tabla de multiplicar del ${numero}</h2><ul>`;
    let i = 1; //Inicia el contador en 1

    while (i <= 10) { //Condición para que el ciclo se ejecute 10 veces
        const resultado = numero * i; //Calcula el resultado de la multiplicación
        htmlTabla += `<li>${numero} x ${i} = ${resultado}</li>`; //Agrega el resultado a la tabla
        i++; //Incrementa el contador en 1
    }

    htmlTabla += '</ul>';
    tablaContainer.innerHTML = htmlTabla; //Muestra la tabla en el contenedor
}
