/*algoritmo que pide dos numeros por pantalla, las compara 
y muestra como resultado el numero mayor */

function mayormenor(){
    var numero1 = document.getElementById('num1').value;
    var numero2 = document.getElementById('num2').value;
    if(numero1 >numero2){
        alert("el numero: "+numero1+" es mayor que el numero: "+numero2);
    }else {
        alert("el numero: "+numero2+" es mayor que el numero: "+numero1 );
    } 
}
