// Seleccionamos el elemento donde se mostrará la operación completa
let operacion = document.getElementById("operacion");

// Seleccionamos el elemento donde se mostrará el resultado de la operación
let resultado = document.getElementById("resultado");

// Seleccionamos todos los botones de números (0-9 y el botón de punto), excluyendo los operadores y funciones especiales
let numeros = document.querySelectorAll(".grid-container input:not([value='AC']):not([value='⌫']):not([value='+/-']):not([value='÷']):not([value='×']):not([value='-']):not([value='+']):not([value='=']):not([value='%'])");

// Seleccionamos los botones que son operadores (+, -, ÷, ×, %)
let operaciones = document.querySelectorAll("[value='÷'], [value='×'], [value='-'], [value='+'], [value='%']");

// Esta variable controla si se puede agregar un punto decimal (.) a un número, para evitar ingresar más de un punto en un número
let puntoPermitido = true;

// Variable para almacenar el operador actual (como +, -, ÷, ×)
let operador = null;

// Variable para almacenar el número actual que se está ingresando
let valorActual = '';

// Variable para almacenar el número anterior, cuando se ha seleccionado un operador
let valorAnterior = '';

// Variable para almacenar la operación completa en formato de texto, que se muestra en la pantalla de la calculadora
let operacionCompleta = '';

// Variable booleana para controlar si el resultado debe invertirse (cuando se presiona el botón +/-)
let resultadoInvertido = false;

// Función para evaluar la expresión matemática, respetando la precedencia de operadores
function evaluarExpresion(expression) {
    try {
        // Dividimos la expresión en tokens (números y operadores), separando por espacios
        let tokens = expression.split(" ");
        let stack = []; // Pila para almacenar los valores durante la evaluación
        
        // Primero, evaluamos las multiplicaciones y divisiones
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] === '×' || tokens[i] === '÷') {
                // Tomamos el número anterior y el número siguiente para realizar la operación
                let operando1 = parseFloat(stack.pop());
                let operando2 = parseFloat(tokens[++i]);
                let resultadoParcial;
                
                // Realizamos la multiplicación o división
                if (tokens[i - 1] === '×') {
                    resultadoParcial = operando1 * operando2;
                } else if (tokens[i - 1] === '÷') {
                    if (operando2 === 0) return "Error"; // Evitar la división por cero
                    resultadoParcial = operando1 / operando2;
                }
                // Guardamos el resultado parcial en la pila
                stack.push(resultadoParcial);
            } else {
                // Si no es una multiplicación o división, guardamos el número en la pila
                stack.push(tokens[i]);
            }
        }
        
        // Luego, evaluamos las sumas y restas
        let resultadoFinal = parseFloat(stack[0]); // Tomamos el primer número
        for (let i = 1; i < stack.length; i += 2) {
            let operador = stack[i]; // Tomamos el operador (+ o -)
            let operando = parseFloat(stack[i + 1]); // Tomamos el número siguiente
            
            // Realizamos la suma o resta
            if (operador === '+') {
                resultadoFinal += operando;
            } else if (operador === '-') {
                resultadoFinal -= operando;
            }
        }
        
        // Devolvemos el resultado final de la operación
        return resultadoFinal;
    } catch (e) {
        // En caso de error, devolvemos "Error"
        return "Error";
    }
}

// Función que actualiza el resultado en pantalla basándose en la operación actual
function actualizarResultado() {
    if (operacionCompleta.trim()) { // Si hay una operación completa (no está vacía)
        let resultadoTemporal = evaluarExpresion(operacionCompleta.trim()); // Evaluamos la expresión
        if (resultadoInvertido) {
            resultadoTemporal *= -1; // Si el resultado está invertido, multiplicamos por -1
        }
        resultado.textContent = resultadoTemporal; // Mostramos el resultado en pantalla
    }
}

// Evento para el botón "AC" (borrar todo), que reinicia la calculadora
document.getElementById("ac").addEventListener("click", function () {
    // Limpiamos todas las variables y reiniciamos los valores
    operacionCompleta = '';
    valorActual = '';
    valorAnterior = '';
    operador = null;
    puntoPermitido = true;
    resultadoInvertido = false; // Reiniciamos el estado del signo
    operacion.textContent = ''; // Limpiamos la pantalla de la operación
    resultado.textContent = '0'; // Mostramos 0 en el resultado
});

// Evento para el botón "⌫" (borrar el último carácter)
document.getElementById("borrar").addEventListener("click", function () {
    // Eliminamos el último carácter de la operación completa
    operacionCompleta = operacionCompleta.trim().slice(0, -1).trim();
    operacion.textContent = operacionCompleta; // Mostramos la operación actualizada
    
    if (!operacionCompleta) {
        // Si la operación queda vacía, mostramos 0 en el resultado
        resultado.textContent = '0';
        valorActual = '';
        valorAnterior = '';
    } else {
        actualizarResultado(); // Si no está vacía, actualizamos el resultado
    }
});

// Añadimos eventos a todos los botones de números
numeros.forEach(function (boton) {
    boton.addEventListener("click", function () {
        // Evitamos agregar más de un punto en el mismo número
        if (boton.value === '.' && !puntoPermitido) return;
        if (boton.value === '.') puntoPermitido = false; // Después de agregar un punto, no permitimos otro
        
        valorActual += boton.value; // Agregamos el número al valor actual
        operacionCompleta += boton.value; // Agregamos el número a la operación completa
        operacion.textContent = operacionCompleta; // Mostramos la operación en pantalla
        actualizarResultado(); // Actualizamos el resultado provisional
    });
});

// Añadimos eventos a los botones de operadores (+, -, ÷, ×, %)
operaciones.forEach(function (boton) {
    boton.addEventListener("click", function () {
        if (!valorActual) return; // Si no hay valor actual, no hacemos nada
        
        // Guardamos el operador seleccionado
        if (boton.value === '÷') operador = '÷';
        else if (boton.value === '×') operador = '×';
        else operador = boton.value;
        
        valorAnterior = valorActual; // Guardamos el valor actual como el valor anterior
        valorActual = ''; // Reseteamos el valor actual para el siguiente número
        operacionCompleta += ` ${boton.value} `; // Agregamos el operador a la operación completa
        operacion.textContent = operacionCompleta.trim(); // Mostramos la operación actualizada
        puntoPermitido = true; // Permitimos agregar un nuevo punto decimal en el siguiente número
        actualizarResultado(); // Actualizamos el resultado provisional
    });
});

// Evento para el botón "=" (calcular el resultado final)
document.getElementById("igual").addEventListener("click", function () {
    if (valorAnterior && valorActual && operador) {
        // Evaluamos la expresión completa
        let resultadoOperacion = evaluarExpresion(operacionCompleta.trim());
        if (resultadoInvertido) {
            // Si el resultado ha sido invertido, lo multiplicamos por -1
            resultadoOperacion *= -1;
        }
        resultado.textContent = resultadoOperacion; // Mostramos el resultado final
        valorActual = resultadoOperacion.toString(); // Actualizamos el valor actual con el resultado
        valorAnterior = ''; // Reseteamos el valor anterior
        operador = null; // Reseteamos el operador
        operacionCompleta = ''; // Limpiamos la operación completa
        resultadoInvertido = false; // Reiniciamos el estado del signo
    }
});

// Evento para el botón "+/-" (cambiar el signo del resultado)
document.getElementById("cambiar-signo").addEventListener("click", function () {
    resultadoInvertido = !resultadoInvertido; // Alternamos el estado del signo invertido
    actualizarResultado(); // Actualizamos el resultado con el nuevo signo
});
