import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView, StyleSheet, Text, RefreshControl,
  Alert, View, ScrollView
} from 'react-native';
import ListeEnseignants from '../../src/components/ListeEnseignants';
import FormulaireModal from '../../src/components/FormulaireModal';
import { getEnseignants, addEnseignant, updateEnseignant, deleteEnseignant } from '../../src/api/api';

export default function HomeScreen() {
  const [enseignants, setEnseignants] = useState([]);
  const [enseignantEdit, setEnseignantEdit] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const chargerEnseignants = useCallback(async () => {
    try {
      const res = await getEnseignants();
      setEnseignants(res.data);
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de charger les données');
    }
  }, []);

  useEffect(() => { chargerEnseignants(); }, []);

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
        Alert.alert('✅ Succès', 'Enseignant modifié avec succès !');
      } else {
        await addEnseignant(data);
        Alert.alert('✅ Succès', 'Enseignant ajouté avec succès !');
      }
      setModalVisible(false);
      setEnseignantEdit(null);
      chargerEnseignants();
    } catch (err: any) {
      Alert.alert('❌ Erreur', err.response?.data?.error || 'Une erreur est survenue');
    }
  };

  const handleDelete = async (matricule: string) => {
    try {
      await deleteEnseignant(matricule);
      chargerEnseignants();
    } catch (err) {
      Alert.alert('Erreur', 'Suppression échouée');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👨‍🏫 Gestion des Enseignants</Text>
        <Text style={styles.headerSub}>{enseignants.length} enseignant(s) enregistré(s)</Text>
      </View>

      {/* Contenu scrollable */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
        onClose={() => { setModalVisible(false); setEnseignantEdit(null); }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F0F2FF' },
  header: {
    backgroundColor: '#3F51B5',
    paddingTop: 16, paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 },
  scroll: { paddingBottom: 20 },
});
