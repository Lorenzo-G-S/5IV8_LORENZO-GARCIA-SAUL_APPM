import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function CalculadoraIMC() {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [resultado, setResultado] = useState('');
  const [categoria, setCategoria] = useState('');

  const calcular = (pesoNuevo, alturaNueva) => {
    const p = pesoNuevo || peso;
    const a = alturaNueva || altura;
    
    if (p && a) {
      const imc = p / (a * a);
      setResultado(imc.toFixed(2));
      
      if (imc < 18.5) {
        setCategoria('Bajo peso');
      } else if (imc < 25) {
        setCategoria('Normal');
      } else if (imc < 30) {
        setCategoria('Sobrepeso');
      } else {
        setCategoria('Obesidad');
      }
    }
  };

  const limpiar = () => {
    setPeso('');
    setAltura('');
    setResultado('');
    setCategoria('');
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Calculadora IMC</Text>
      
      <Text style={styles.etiqueta}>Peso (kg):</Text>
      <TextInput
        style={styles.campo}
        value={peso}
        onChangeText={(texto) => {
          setPeso(texto);
          calcular(texto, null);
        }}
        keyboardType="numeric"
      />
      
      <Text style={styles.etiqueta}>Altura (m):</Text>
      <TextInput
        style={styles.campo}
        value={altura}
        onChangeText={(texto) => {
          setAltura(texto);
          calcular(null, texto);
        }}
        keyboardType="numeric"
      />
      
      <Text style={styles.etiqueta}>Resultado:</Text>
      <Text style={styles.resultado}>{resultado}</Text>
      
      <Text style={styles.categoria}>{categoria}</Text>

      <TouchableOpacity style={styles.boton} onPress={limpiar}>
        <Text style={styles.textoBoton}>Limpiar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    backgroundColor: '#d8ccf0ff',
    paddingTop: 80,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  etiqueta: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 5,
  },
  campo: {
    borderWidth: 1,
    borderColor: '#000000',
    padding: 10,
    fontSize: 18,
    borderRadius: 5,
  },
  resultado: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    padding: 10,
  },
  categoria: {
    fontSize: 20,
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  boton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 5,
    marginTop: 30,
  },
  textoBoton: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});