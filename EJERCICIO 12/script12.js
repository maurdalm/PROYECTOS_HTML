function operar(op) {
  let op1 = parseFloat(prompt("Operando 1:"));
  let op2 = parseFloat(prompt("Operando 2:"));
  let resultado;

  if (isNaN(op1) || isNaN(op2)) {
      alert("Debe ingresar números válidos.");
      return;
  }

  switch(op) {
    case 1:
      resultado = op1 + op2;
      break;
    case 2:
      resultado = op1 - op2;
      break;
    case 3:
      resultado = op1 * op2;
      break;
    case 4:
      if (op2 === 0) {
        alert("Error: División por cero.");
        return;
      }
      resultado = op1 / op2;
      break;
    default:
      return;
  }

  document.getElementById("resultado").innerHTML = "RESULTADO: " + resultado;
}

function salir() {
  document.body.innerHTML = "<h1>FIN...</h1>";
}