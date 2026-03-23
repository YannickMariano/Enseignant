import React, { useCallback, useEffect, useState } from "react";
import {
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
} from "../../src/api/api";
import FormulaireModal from "../../src/components/FormulaireModal";
import ListeEnseignants from "../../src/components/ListeEnseignants";
import Toast from "../../src/components/Toast";

export default function HomeScreen() {
  const [enseignants, setEnseignants] = useState([]);
  const [enseignantEdit, setEnseignantEdit] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ État du Toast
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: string = "success") => {
    setToast({ visible: true, message, type });
  };

  const chargerEnseignants = useCallback(async () => {
    try {
      const res = await getEnseignants();
      setEnseignants(res.data);
    } catch (err) {
      showToast("Impossible de charger les données", "error");
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

  const handleAdd = () => {
    setEnseignantEdit(null);
    setModalVisible(true);
  };

  const handleEdit = (enseignant: any) => {
    setEnseignantEdit(enseignant);
    setModalVisible(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (enseignantEdit) {
        await updateEnseignant((enseignantEdit as any).matricule, data);
        showToast(`${data.nom} modifié avec succès !`, "success");
      } else {
        await addEnseignant(data);
        showToast(`${data.nom} ajouté avec succès !`, "success");
      }
      setModalVisible(false);
      setEnseignantEdit(null);
      chargerEnseignants();
    } catch (err: any) {
      const msg = err.response?.data?.error || "Une erreur est survenue";
      showToast(msg, "error");
    }
  };

  const handleDelete = async (matricule: string) => {
    try {
      await deleteEnseignant(matricule);
      showToast(`Enseignant supprimé avec succès`, "warning");
      chargerEnseignants();
    } catch (err) {
      showToast("Suppression échouée", "error");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestion des Enseignants</Text>
        <Text style={styles.headerSub}>
          {enseignants.length} enseignant(s) enregistré(s)
        </Text>
      </View>

      {/* Contenu */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ListeEnseignants
          enseignants={enseignants}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </ScrollView>

      {/* Modal Formulaire */}
      <FormulaireModal
        visible={modalVisible}
        enseignantEdit={enseignantEdit}
        onSubmit={handleSubmit}
        onClose={() => {
          setModalVisible(false);
          setEnseignantEdit(null);
        }}
      />

      {/* ✅ Toast — affiché par-dessus tout */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F0F2FF" },
  header: {
    backgroundColor: "#3F51B5",
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "800" },
  headerSub: { color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 },
  scroll: { paddingBottom: 20 },
});
