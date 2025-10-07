import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function Calculadora() {
  const [numero, setNumero] = useState("0");
  const [numeroAnterior, setNumeroAnterior] = useState("");
  const [operacion, setOperacion] = useState("");

  const agregarNumero = (num) => {
    if (numero === "0") {
      setNumero(num);
    } else {
      setNumero(numero + num);
    }
  };

  const seleccionarOperacion = (op) => {
    setNumeroAnterior(numero);
    setNumero("0");
    setOperacion(op);
  };

  const calcular = () => {
    const num1 = parseFloat(numeroAnterior);
    const num2 = parseFloat(numero);
    let resultado = 0;

    if (operacion === "+") resultado = num1 + num2;
    if (operacion === "-") resultado = num1 - num2;
    if (operacion === "*") resultado = num1 * num2;
    if (operacion === "/") resultado = num1 / num2;

    setNumero(resultado.toString());
    setNumeroAnterior("");
    setOperacion("");
  };

  const borrarTodo = () => {
    setNumero("0");
    setNumeroAnterior("");
    setOperacion("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Calculadora</Text>
      <Text style={styles.display}>{numero}</Text>
      
      <View style={styles.numeros}>
        <View style={styles.fila}>
          <Button title="1" onPress={() => agregarNumero("1")} />
          <Button title="2" onPress={() => agregarNumero("2")} />
          <Button title="3" onPress={() => agregarNumero("3")} />
        </View>
        <View style={styles.fila}>
          <Button title="4" onPress={() => agregarNumero("4")} />
          <Button title="5" onPress={() => agregarNumero("5")} />
          <Button title="6" onPress={() => agregarNumero("6")} />
        </View>
        <View style={styles.fila}>
          <Button title="7" onPress={() => agregarNumero("7")} />
          <Button title="8" onPress={() => agregarNumero("8")} />
          <Button title="9" onPress={() => agregarNumero("9")} />
        </View>
        <View style={styles.fila}>
          <Button title="0" onPress={() => agregarNumero("0")} />
        </View>
      </View>

      <View style={styles.operaciones}>
        <Button title="+" onPress={() => seleccionarOperacion("+")} />
        <Button title="-" onPress={() => seleccionarOperacion("-")} />
        <Button title="*" onPress={() => seleccionarOperacion("*")} />
        <Button title="/" onPress={() => seleccionarOperacion("/")} />
      </View>

      <View style={styles.acciones}>
        <Button title="=" onPress={calcular} color="green" />
        <Button title="Borrar" onPress={borrarTodo} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#353549ff",
    padding: 20,
  },
  titulo: {
    fontSize: 40,
    marginBottom: 20,
  },
  display: {
    fontSize: 48,
    marginBottom: 30,
    padding: 10,
    backgroundColor: "white",
    minWidth: 200,
    textAlign: "right",
  },
  numeros: {
    marginBottom: 20,
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 150,
    marginBottom: 10,
  },
  operaciones: {
    flexDirection: "row",
    width: 150,
    justifyContent: "space-between",
    marginBottom: 20,
  },
  acciones: {
    flexDirection: "row",
    width: 100,
    justifyContent: "space-between",
  },
});