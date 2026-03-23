import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  addEnseignant,
  deleteEnseignant,
  getEnseignants,
  updateEnseignant,
} from "./src/api/api";
import FormulaireEnseignant from "./src/components/FormulaireEnseignant";
import GraphiqueCamembert from "./src/components/GraphiqueCamembert";
import ListeEnseignants from "./src/components/ListeEnseignants";

export default function App() {
  const [enseignants, setEnseignants] = useState([]);
  const [enseignantEdit, setEnseignantEdit] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const chargerEnseignants = useCallback(async () => {
    try {
      const res = await getEnseignants();
      setEnseignants(res.data);
    } catch (err) {
      Alert.alert("Erreur", "Impossible de charger les données");
    }
  }, []);

  useEffect(() => {
    chargerEnseignants();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await chargerEnseignants();
    setRefreshing(false);
  };

  const handleSubmit = async (data) => {
    try {
      if (enseignantEdit) {
        await updateEnseignant(data.matricule, data);
        Alert.alert("Succès", "Enseignant modifié !");
      } else {
        await addEnseignant(data);
        Alert.alert("Succès", "Enseignant ajouté !");
      }
      setEnseignantEdit(null);
      chargerEnseignants();
    } catch (err) {
      Alert.alert(
        "Erreur",
        err.response?.data?.error || "Une erreur est survenue",
      );
    }
  };

  const handleDelete = async (matricule) => {
    try {
      await deleteEnseignant(matricule);
      chargerEnseignants();
    } catch (err) {
      Alert.alert("Erreur", "Suppression échouée");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestion des Enseignants</Text>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <FormulaireEnseignant
          onSubmit={handleSubmit}
          enseignantEdit={enseignantEdit}
          onCancelEdit={() => setEnseignantEdit(null)}
        />
        <ListeEnseignants
          enseignants={enseignants}
          onEdit={setEnseignantEdit}
          onDelete={handleDelete}
        />
        <GraphiqueCamembert enseignants={enseignants} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F5F5" },
  header: { backgroundColor: "#3F51B5", padding: 16, alignItems: "center" },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
});
