
const DNI_CONFIG = {
    LETRAS: ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E', 'T'],
    
    MIN_NUMERO: 0,
    MAX_NUMERO: 99999999,
    
    DIVISOR_MODULO: 23,
    
    REGEX_LETRA: /^[TRWAGMYFPDXBNJZSQVHLCKET]$/,
    
    MENSAJES: {
        CAMPOS_VACIOS: ' Por favor, introduce tanto el número como la letra del DNI.',
        NUMERO_INVALIDO: ' El número proporcionado no es válido. Debe estar entre 0 y 99999999.',
        LETRA_INVALIDA: 'La letra introducida no es válida. Solo se permiten letras del alfabeto del DNI.',
        LETRA_INCORRECTA: (letraUsuario, letraCorrecta) => 
            ` La letra "${letraUsuario}" no es correcta. La letra correcta es: "${letraCorrecta}"`,
        DNI_CORRECTO: (numero, letra) => 
            ` ¡Excelente! El DNI ${numero}${letra} es completamente válido.`,
        CALCULO_INFO: (numero, resto, letra) => 
            ` Cálculo: ${numero} ÷ 23 = resto ${resto} → letra "${letra}"`
    }
};

class ValidadorDNI {
    constructor() {
        this.inicializarEventos();
        this.estadisticas = {
            validaciones: 0,
            correctos: 0,
            errores: 0
        };
    }

    inicializarEventos() {
        const botonValidar = document.querySelector('button');
        if (botonValidar) {
            botonValidar.addEventListener('click', () => this.validarDNI());
        }

        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.validarDNI();
            }
        });

        const campoNumero = document.getElementById('numeroDNI');
        if (campoNumero) {
            campoNumero.addEventListener('input', (e) => this.validarNumeroTiempoReal(e));
            
            campoNumero.addEventListener('input', () => this.limpiarResultado());
        }

        const campoLetra = document.getElementById('letraDNI');
        if (campoLetra) {
            campoLetra.addEventListener('input', (e) => this.procesarLetra(e));
            
            campoLetra.addEventListener('input', () => this.limpiarResultado());
            
            campoLetra.addEventListener('keypress', (e) => this.validarTeclaLetra(e));
        }

        this.inicializarAyudasVisuales();
    }

    validarDNI() {
        try {
            this.estadisticas.validaciones++;

            const datosFormulario = this.obtenerDatosFormulario();
            
            const resultadoValidacion = this.realizarValidaciones(datosFormulario);
            
            this.mostrarResultado(resultadoValidacion);
            
            this.actualizarEstadisticas(resultadoValidacion.esValido);
            
            this.logDebug(datosFormulario, resultadoValidacion);
            
        } catch (error) {
            console.error('Error en la validación del DNI:', error);
            this.mostrarError('❌ Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.');
        }
    }

    obtenerDatosFormulario() {
        const numeroInput = document.getElementById('numeroDNI');
        const letraInput = document.getElementById('letraDNI');
        
        return {
            numeroOriginal: numeroInput?.value?.trim() || '',
            letraOriginal: letraInput?.value?.trim()?.toUpperCase() || '',
            numero: parseInt(numeroInput?.value?.trim()) || null,
            letra: letraInput?.value?.trim()?.toUpperCase() || ''
        };
    }

    realizarValidaciones(datos) {
        if (this.validarCamposVacios(datos)) {
            return {
                esValido: false,
                tipo: 'error',
                mensaje: DNI_CONFIG.MENSAJES.CAMPOS_VACIOS
            };
        }

        if (datos.numero < DNI_CONFIG.MIN_NUMERO || datos.numero > DNI_CONFIG.MAX_NUMERO) {
            return {
                esValido: false,
                tipo: 'error',
                mensaje: DNI_CONFIG.MENSAJES.NUMERO_INVALIDO
            };
        }

        if (!DNI_CONFIG.REGEX_LETRA.test(datos.letra)) {
            return {
                esValido: false,
                tipo: 'error',
                mensaje: DNI_CONFIG.MENSAJES.LETRA_INVALIDA
            };
        }

        const calculoResultado = this.calcularLetraDNI(datos.numero);

        if (datos.letra !== calculoResultado.letraCorrecta) {
            return {
                esValido: false,
                tipo: 'error',
                mensaje: DNI_CONFIG.MENSAJES.LETRA_INCORRECTA(datos.letra, calculoResultado.letraCorrecta),
                detalleCalculo: DNI_CONFIG.MENSAJES.CALCULO_INFO(
                    datos.numero, 
                    calculoResultado.resto, 
                    calculoResultado.letraCorrecta
                )
            };
        }

        return {
            esValido: true,
            tipo: 'correcto',
            mensaje: DNI_CONFIG.MENSAJES.DNI_CORRECTO(datos.numero, datos.letra),
            detalleCalculo: DNI_CONFIG.MENSAJES.CALCULO_INFO(
                datos.numero, 
                calculoResultado.resto, 
                calculoResultado.letraCorrecta
            )
        };
    }

    calcularLetraDNI(numero) {
        const resto = numero % DNI_CONFIG.DIVISOR_MODULO;
        const letraCorrecta = DNI_CONFIG.LETRAS[resto];
        
        return {
            resto,
            letraCorrecta,
            posicionArray: resto
        };
    }

    validarCamposVacios(datos) {
        return isNaN(datos.numero) || datos.numero === null || datos.letra === '';
    }

    mostrarResultado(resultado) {
        const elementoResultado = document.getElementById('resultado');
        if (!elementoResultado) return;

        elementoResultado.className = 'resultado';
        
        let contenidoHTML = `
            <div class="mensaje-principal">${resultado.mensaje}</div>
        `;
        
        if (resultado.detalleCalculo) {
            contenidoHTML += `
                <div class="detalle-calculo">${resultado.detalleCalculo}</div>
            `;
        }

        if (resultado.esValido) {
            contenidoHTML += `
                <div class="estadisticas">
                    Validación #${this.estadisticas.validaciones} | 
                    Correctos: ${this.estadisticas.correctos + 1} | 
                    Errores: ${this.estadisticas.errores}
                </div>
            `;
        }

        elementoResultado.innerHTML = contenidoHTML;
        
        setTimeout(() => {
            elementoResultado.classList.add(resultado.tipo);
        }, 50);

        if (window.innerWidth <= 768) {
            elementoResultado.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }


    procesarLetra(evento) {
        const input = evento.target;
        let valor = input.value.toUpperCase();
        
        valor = valor.replace(/[^TRWAGMYFPDXBNJZSQVHLCKET]/g, '');
        
        if (valor.length > 1) {
            valor = valor.charAt(0);
        }
        
        input.value = valor;
        
        if (valor && DNI_CONFIG.REGEX_LETRA.test(valor)) {
            input.style.borderColor = '#48bb78';
            input.style.boxShadow = '0 0 0 3px rgba(72, 187, 120, 0.1)';
        } else if (valor) {
            input.style.borderColor = '#f56565';
            input.style.boxShadow = '0 0 0 3px rgba(245, 101, 101, 0.1)';
        } else {
            input.style.borderColor = '#e2e8f0';
            input.style.boxShadow = 'none';
        }
    }


    validarNumeroTiempoReal(evento) {
        const input = evento.target;
        const valor = parseInt(input.value);
        
        if (isNaN(valor)) {
            input.style.borderColor = '#e2e8f0';
            input.style.boxShadow = 'none';
            return;
        }
        
        if (valor >= DNI_CONFIG.MIN_NUMERO && valor <= DNI_CONFIG.MAX_NUMERO) {
            input.style.borderColor = '#48bb78';
            input.style.boxShadow = '0 0 0 3px rgba(72, 187, 120, 0.1)';
        } else {
            input.style.borderColor = '#f56565';
            input.style.boxShadow = '0 0 0 3px rgba(245, 101, 101, 0.1)';
        }
    }


    validarTeclaLetra(evento) {
        const caracter = evento.key.toUpperCase();
        
        if (evento.ctrlKey || evento.altKey || 
            ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(evento.key)) {
            return;
        }
        
        if (!DNI_CONFIG.REGEX_LETRA.test(caracter)) {
            evento.preventDefault();
            this.mostrarFeedbackTemporal(evento.target, 'Solo letras válidas del DNI');
        }
    }

    mostrarFeedbackTemporal(elemento, mensaje) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip-temporal';
        tooltip.textContent = mensaje;
        tooltip.style.cssText = `
            position: absolute;
            background: #2d3748;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            z-index: 1000;
            pointer-events: none;
            transform: translateX(-50%);
            white-space: nowrap;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = elemento.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 + 'px';
        tooltip.style.top = rect.top - 35 + 'px';
        
        setTimeout(() => {
            tooltip.remove();
        }, 2000);
    }


    limpiarResultado() {
        const resultado = document.getElementById('resultado');
        if (resultado && resultado.innerHTML.trim() !== '') {
            resultado.className = 'resultado';
            resultado.innerHTML = '';
        }
    }

 
    actualizarEstadisticas(esValido) {
        if (esValido) {
            this.estadisticas.correctos++;
        } else {
            this.estadisticas.errores++;
        }
    }

 
    inicializarAyudasVisuales() {
        const campoNumero = document.getElementById('numeroDNI');
        const campoLetra = document.getElementById('letraDNI');
        
        if (campoNumero) {
            campoNumero.placeholder = `Ej: ${this.generarEjemploNumero()}`;
        }
        
        if (campoLetra) {
            const numeroEjemplo = this.generarEjemploNumero();
            const letraEjemplo = this.calcularLetraDNI(numeroEjemplo).letraCorrecta;
            campoLetra.placeholder = `Ej: ${letraEjemplo}`;
        }
    }


    generarEjemploNumero() {
        return Math.floor(Math.random() * 89999999) + 10000000; // Entre 10000000 y 99999999
    }


    mostrarError(mensaje) {
        this.mostrarResultado({
            esValido: false,
            tipo: 'error',
            mensaje: mensaje
        });
    }


    logDebug(datos, resultado) {
        if (console && typeof console.log === 'function') {
            console.log('Debug DNI:', {
                entrada: datos,
                resultado: resultado,
                estadisticas: this.estadisticas
            });
        }
    }
}


const UtilsDNI = {

    generarDNIAleatorio() {
        const numero = Math.floor(Math.random() * 99999999);
        const letra = DNI_CONFIG.LETRAS[numero % DNI_CONFIG.DIVISOR_MODULO];
        return { numero, letra, completo: `${numero}${letra}` };
    },


    validarDNICompleto(dniCompleto) {
        const regex = /^(\d{1,8})([TRWAGMYFPDXBNJZSQVHLCKET])$/;
        const match = dniCompleto.match(regex);
        
        if (!match) return false;
        
        const numero = parseInt(match[1]);
        const letra = match[2];
        
        if (numero < 0 || numero > 99999999) return false;
        
        const letraCorrecta = DNI_CONFIG.LETRAS[numero % DNI_CONFIG.DIVISOR_MODULO];
        return letra === letraCorrecta;
    },


    formatearNumero(numero) {
        return numero.toString().padStart(8, '0');
    }
};


document.addEventListener('DOMContentLoaded', function() {
    console.log(' Iniciando Validador de DNI Avanzado...');
    
    window.validadorDNI = new ValidadorDNI();
    
    console.log(' Validador de DNI inicializado correctamente');
    
    if (typeof window !== 'undefined') {
        window.UtilsDNI = UtilsDNI;
    }
});


function validarDNI() {
    if (window.validadorDNI) {
        window.validadorDNI.validarDNI();
    } else {
        console.error(' El validador no está inicializado');
    }
}