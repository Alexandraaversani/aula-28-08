import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [tarefa, setTarefa] = useState("");
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    carregarTarefas();
  }, []);

  const carregarTarefas = async () => {
    try {
      const lista = await AsyncStorage.getItem("tarefas");
      if (lista !== null) {
        setTarefas(JSON.parse(lista));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const salvarTarefas = async (lista) => {
    try {
      await AsyncStorage.setItem("tarefas", JSON.stringify(lista));
    } catch (error) {
      console.log(error);
    }
  };

  const adicionarTarefa = () => {
    if (tarefa.trim() === "") {
      Alert.alert("Atenção", "Digite uma tarefa antes de adicionar!");
      return;
    }
    const novaLista = [...tarefas, { id: Date.now().toString(), texto: tarefa }];
    setTarefas(novaLista);
    salvarTarefas(novaLista);
    setTarefa("");
  };

  const excluirTarefa = (id) => {
    const novaLista = tarefas.filter((item) => item.id !== id);
    setTarefas(novaLista);
    salvarTarefas(novaLista);
  };

  const limparTudo = async () => {
    await AsyncStorage.removeItem("tarefas");
    setTarefas([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🌙 Lista de Tarefas</Text>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma tarefa..."
          value={tarefa}
          onChangeText={setTarefa}
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.botao} onPress={adicionarTarefa}>
          <Text style={styles.botaoTexto}>+</Text>
        </TouchableOpacity>
      </View>

      {tarefas.length === 0 ? (
        <Text style={styles.mensagem}>Nada por aqui... ✨</Text>
      ) : (
        <FlatList
          data={tarefas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.texto}>{item.texto}</Text>
              <TouchableOpacity
                style={styles.excluir}
                onPress={() => excluirTarefa(item.id)}
              >
                <Text style={styles.excluirTexto}>🗑</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {tarefas.length > 0 && (
        <TouchableOpacity style={styles.limpar} onPress={limparTudo}>
          <Text style={styles.limparTexto}>Limpar Tudo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#121212", // fundo escuro
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#00FFCC", // neon verde/azulado
  },
  inputArea: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#1E1E1E",
    color: "#fff",
    borderWidth: 1,
    borderColor: "#333",
  },
  botao: {
    marginLeft: 10,
    backgroundColor: "#FF007F", // rosa neon
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF007F",
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: "#00FFCC", // detalhe neon na lateral
  },
  texto: {
    fontSize: 17,
    color: "#fff",
  },
  excluir: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#FF007F",
  },
  excluirTexto: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  limpar: {
    marginTop: 20,
    backgroundColor: "#FF007F",
    padding: 15,
    borderRadius: 14,
    shadowColor: "#FF007F",
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
  },
  limparTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  mensagem: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 50,
    color: "#aaa",
  },
});




